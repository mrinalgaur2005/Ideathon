import { NextRequest, NextResponse } from "next/server";
import { getServerSession, User } from "next-auth";
import { writeFile, createReadStream } from "fs";
import { unlink } from "fs/promises";
import { join } from "path";
import csvParser from "csv-parser";
import { authOptions } from "../../(auth)/auth/[...nextauth]/options";
import dbConnect from "../../../../lib/connectDb";
import { MarksModel } from "../../../../model/User";

interface CSVRow {
  student_id: string;
  [key: string]: string;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { teacherId: string } }
) {
  let filePath: string | null = null;

  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !user) {
      return NextResponse.json(
        { error: "Unauthorized. User must be logged in." },
        { status: 401 }
      );
    }

    const teacherId = params.teacherId;

    if (!teacherId) {
      return NextResponse.json(
        { error: "Teacher ID is required." },
        { status: 400 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    const subjectId = formData.get("subjectId")?.toString(); 

    if (!subjectId) {
      return NextResponse.json(
        { error: "Subject ID is required in the form data." },
        { status: 400 }
      );
    }

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    if (!file.name.endsWith(".csv")) {
      return NextResponse.json(
        { error: "Only CSV files are allowed" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const timestamp = Date.now();
    filePath = join("/tmp", `upload-${timestamp}.csv`);

    await new Promise((resolve, reject) => {
      writeFile(filePath!, buffer, (err) => {
        if (err) reject(err);
        else resolve(true);
      });
    });

    const updates = new Map<string, Map<string, { [key: string]: number }>>(); // Track updates

    await new Promise<void>((resolve, reject) => {
      createReadStream(filePath!)
        .pipe(csvParser())
        .on("data", (row: CSVRow) => {
          const studentId = row.student_id;
          if (!studentId) return;

          const marksUpdate: { [key: string]: number } = {};

          for (const [key, value] of Object.entries(row)) {
            if (key === "student_id") continue;

            const marks = parseFloat(value);
            if (!isNaN(marks) && marks >= 0) {
              marksUpdate[key] = marks;
            }
          }

          if (!updates.has(subjectId)) {
            updates.set(subjectId, new Map());
          }

          const subjectMap = updates.get(subjectId)!;
          if (!subjectMap.has(studentId)) {
            subjectMap.set(studentId, marksUpdate);
          } else {
            Object.assign(subjectMap.get(studentId)!, marksUpdate);
          }
        })
        .on("end", resolve)
        .on("error", reject);
    });

    for (const [subject, students] of updates.entries()) {
      const allStudentMarks: { [key: string]: any } = {};

      for (const [studentId, marks] of students.entries()) {
        allStudentMarks[studentId] = Object.entries(marks).map(([examName, value]) => ({
          [examName]: value,
        }));
      }

      await MarksModel.updateOne(
        { [`subjects.${subject}`]: { $exists: true } },
        {
          $set: {
            [`subjects.${subject}`]: allStudentMarks,
          },
        },
        { upsert: true }
      );
    }

    return NextResponse.json({
      message: "Marks updated successfully.",
      subjectsUpdated: updates.size,
    });
  } catch (error) {
    console.error("CSV processing error:", error);
    return NextResponse.json(
      {
        error: "An error occurred while processing the file.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  } finally {
    if (filePath) {
      try {
        await unlink(filePath);
      } catch (error) {
        console.error("Failed to delete temporary file:", error);
      }
    }
  }
}
