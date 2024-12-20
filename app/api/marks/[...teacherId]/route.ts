import { NextResponse } from "next/server";
import dbConnect from "../../../../lib/connectDb";
import { StudentModel } from "../../../../model/User";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../../(auth)/auth/[...nextauth]/options";
import mongoose from "mongoose";
import multer from "multer";
import csvParser from "csv-parser";
import fs from "fs";
import path from "path";

const upload = multer({
  storage: multer.diskStorage({
    destination: "../../../public/temp",
    filename: (req, file, cb) => cb(null, file.originalname),
  }),
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
    console.log("Route reached");

    const teacherId = params.teacherId;
    const subjectId = "MHN2001";
    if (!teacherId || !subjectId) {
      return NextResponse.json(
        { error: "Teacher ID and Subject ID are required." },
        { status: 400 }
      );
    }

    const form = new Promise<{ filePath: string }>((resolve, reject) => {
      const uploadHandler = upload.single("file");
      const reqBody = req as any; 
      uploadHandler(reqBody, {} as any, (err) => {
        if (err) reject(err);
        else resolve({ filePath: `../../../public/temp${reqBody.file.originalname}` });
      });
    });

    console.log("Route reached");


    const { filePath } = await form;

    const marksStudentMap: Record<string, Record<string, number>> = {};
    const results: string[] = [];
    const fileStream = fs.createReadStream(filePath);

    await new Promise<void>((resolve, reject) => {
      fileStream
        .pipe(csvParser())
        .on("data", async (row: Record<string, string>) => {
          const studentId = row["student_id"];
          if (!studentId) return; 

          const student = await findStudentById(studentId);
          if (!student) return;

          const subjectMap = marksStudentMap[studentId];
          if (!subjectMap) return;

          for (const key of Object.keys(row)) {
            if (key === "student_id") continue; 

            const marks = parseFloat(row[key]);
            if (!isNaN(marks)) {
              subjectMap[key] = (subjectMap[key] || 0) + marks; 
            }
          }
        })
        .on("end", () => resolve())
        .on("error", (err) => reject(err));
    });

    console.log("Route reached");


    fs.unlinkSync(filePath);

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

async function findStudentById(studentId: string): Promise<any> {
  return StudentModel.findOne({ student_id: studentId });
}

