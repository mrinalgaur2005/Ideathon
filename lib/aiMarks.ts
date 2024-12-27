import { aiChatBotModel } from "../model/User";
import dbConnect from "./connectDb";

export async function getAiMarks(subjectId: string, trimmedRow: any) {
  await dbConnect();

  const aiMarks = await aiChatBotModel.findById("676da65f9e48cdfb0b216f48");
  if (!aiMarks) {
    return null; 
  }

  const studentId = trimmedRow.student_id;
  const marks = trimmedRow.marks;
  const subject = trimmedRow.subject;

  if (!studentId || !marks || !subject) {
    return null;
  }

  const newMark = {
    subject: subject,
    marks: `${studentId} has scored ${marks}`,
  };

  aiMarks.Info.marks = aiMarks.Info.marks || []; 
  aiMarks.Info.marks.push(newMark);

  await aiMarks.save();

  console.log("Marks added successfully:", newMark);
  return aiMarks;
}
