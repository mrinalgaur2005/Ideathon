import { NextResponse } from "next/server";
import dbConnect from "../../../../lib/connectDb";
import { StudentModel } from "../../../../model/User";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../../(auth)/auth/[...nextauth]/options";
import multer from "multer";
import csvParser from "csv-parser";
import fs from "fs/promises";
import path from "path";

const tempDir = path.join(process.cwd(), "public", "temp");

const upload = multer({
  storage: multer.diskStorage({
    destination: tempDir,
    filename: (req, file, cb) => cb(null, file.originalname),
  }),
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "text/csv") {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only CSV files are allowed.") as any, false);
    }
  },
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function PATCH(
  req: Request,
  { params }: { params: { teacherId: string } }
) {
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
    const filePath = await new Promise<string>((resolve, reject) => {
      const uploadHandler = upload.single("file");
      const reqBody = req as any; 
      uploadHandler(reqBody, {} as any, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(path.join(tempDir, reqBody.file.originalname));
        }
      });
    });
    
    const fileStream = await fs.open(filePath, "r");
    const students = await StudentModel.find();
    const studentMap = students.reduce(
      (acc, student) => ({ ...acc, [student.student_id as string] : student }),
      {} as Record<string, any>
    );

    await new Promise<void>((resolve, reject) => {
      const stream = fileStream.createReadStream();
      stream
        .pipe(csvParser())
        .on("data", (row: Record<string, string>) => {
          const studentId = row["student_id"];
          if (!studentId || !studentMap[studentId]) return;

          const student = studentMap[studentId];
          for (const key in row) {
            if (key !== "student_id") {
              const marks = parseFloat(row[key]);
              if (!isNaN(marks)) {
                student.marks[key] = (student.marks[key] || 0) + marks;
              }
            }
          }
        })
        .on("end", resolve)
        .on("error", reject);
    });
    const savePromises = Object.values(studentMap).map((student) =>
      student.save()
    );
    await Promise.all(savePromises);

    await fs.unlink(filePath);

    return NextResponse.json(
      { message: "CSV processed and marks updated successfully." },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "An error occurred while processing the file." },
      { status: 500 }
    );
  }
}
