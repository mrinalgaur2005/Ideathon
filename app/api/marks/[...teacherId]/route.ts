import { NextRequest, NextResponse } from "next/server";
import { getServerSession, User } from "next-auth";
import { writeFile, createReadStream } from "fs";
import { unlink } from "fs/promises";
import { join } from "path";
import csvParser from "csv-parser";
import { authOptions } from "../../(auth)/auth/[...nextauth]/options";
import dbConnect from "../../../../lib/connectDb";
import { StudentModel } from "../../../../model/User";

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
    const subjectId = "MHN2001";
    if (!teacherId || !subjectId) {
      return NextResponse.json(
        { error: "Teacher ID and Subject ID are required." },
        { status: 400 }
      );
    }

    // Handle file upload
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    // Verify file type
    if (!file.name.endsWith('.csv')) {
      return NextResponse.json(
        { error: "Only CSV files are allowed" },
        { status: 400 }
      );
    }

    // Create temporary file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create a unique filename
    const timestamp = Date.now();
    filePath = join('/tmp', `upload-${timestamp}.csv`);

    // Write the file
    await new Promise((resolve, reject) => {
      writeFile(filePath!, buffer, (err) => {
        if (err) reject(err);
        else resolve(true);
      });
    });

    // Fetch all students in one query for better performance
    const students = await StudentModel.find({}, { student_id: 1, marksStudentMap: 1 });
    const studentMap = new Map(
      students.map(student => [student.student_id, student])
    );

    // Process CSV with proper error handling
    const updates = new Map<string, { [key: string]: number }>();

    await new Promise<void>((resolve, reject) => {
      createReadStream(filePath!)
        .pipe(csvParser())
        .on("data", (row: CSVRow) => {
          const studentId = row.student_id;
          if (!studentId || !studentMap.has(studentId)) return;

          const marksUpdate: { [key: string]: number } = {};
          let hasValidMarks = false;

          for (const [key, value] of Object.entries(row)) {
            if (key === "student_id") continue;

            const marks = parseFloat(value);
            if (!isNaN(marks) && marks >= 0) {
              // Create the dot notation for nested field updates
              marksUpdate[`marksStudentMap.${subjectId}.${key}`] = marks;
              hasValidMarks = true;
            }
          }

          if (hasValidMarks) {
            updates.set(studentId, marksUpdate);
          }
        })
        .on("end", resolve)
        .on("error", reject);
    });

    // Create bulk operations with proper atomic operators and dot notation
    const bulkOps = Array.from(updates.entries()).map(([studentId, marksUpdate]) => ({
      updateOne: {
        filter: { student_id: studentId },
        update: { $set: marksUpdate }
      }
    }));

    if (bulkOps.length > 0) {
      await StudentModel.bulkWrite(bulkOps);
    }

    return NextResponse.json({
      message: "CSV processed and marks updated successfully.",
      studentsUpdated: updates.size,
    });

  } catch (error) {
    console.error("CSV processing error:", error);
    return NextResponse.json(
      { 
        error: "An error occurred while processing the file.",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );

  } finally {
    // Clean up uploaded file
    if (filePath) {
      try {
        await unlink(filePath);
      } catch (error) {
        console.error("Failed to delete temporary file:", error);
      }
    }
  }
}
