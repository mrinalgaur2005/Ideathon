import { NextRequest, NextResponse } from "next/server";
import  extractTextFromImageLinks, { extractDetails } from "../../../../lib/sidVerification";
import { StudentModel, UserModel } from "../../../../model/User";
import dbConnect from "../../../../lib/connectDb";
import Groq from 'groq-sdk';

const groqClient = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});


const extractNameFromEmail = (email: string | undefined): string | null => {
  if (!email || typeof email !== 'string') {
    return null;
  }

  const match = email.match(/^([a-zA-Z]+)\.bt\d+([a-z]+)@pec\.edu\.in$/);
  return match ? match[1] : null;
};


interface AiNameCheckerResponse {
  choices: {
    message: {
      content: string | null;
    };
  }[];
}

const aiNameChecker = async (emailName: string, name: string): Promise<boolean> => {
  const prompt = `I am going to give you two string, you have to tell me if they are same or not. \n\nString 1: ${emailName} \nString 2: ${name} \n\nAre these strings same? They dont have to be exactly equal. String like antriikshguppta and Antriksh Gupta are considered Same. One of the strings is coming from an OCR, so its expected to have some mistakes in reading. Your work is to overlook these mistakes and tell me by your thinking whether they are same names or not.\n\nPlease type yes or no and dont type any other text. just yes or no.`;

  const completion: AiNameCheckerResponse = await groqClient.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: 'llama3-8b-8192',
  });

  const result = completion.choices[0]?.message?.content;
  return result === 'yes';
}

export async function POST(request: NextRequest) {
  console.log("inside api");

  await dbConnect();

  try {
    const { username, image } = await request.json();

    if (!username || !image) {
      return NextResponse.json(
        { success: false, message: 'Missing username or image in request body' },
        { status: 400 }
      );
    }
    console.log(username);
    const user = await UserModel.findOne({ username: username });
    const student = await StudentModel.findOne({ name: username });

    if (!student) {
      console.log("student here");
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    if (user) {
      user.sid_verification = true;
      await user.save();
    } else {
      console.log("user here");
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    const sidVerification = student.sid_verification;
    if (!sidVerification) {
      const imageLinks = [image];
      const results = await extractTextFromImageLinks(imageLinks);

      if (results[image]) {
        const { name, department, identityNo } = extractDetails(results[image]);

        console.log(department);
        console.log(name);

        const emailName = extractNameFromEmail(student.email as string);

        console.log(`emailName ${emailName}`);
        console.log(name?.toLowerCase().trim().replace(/\s+/g, ''));
        
// emailName && emailName.toLowerCase() === name?.toLowerCase().trim().replace(/\s+/g, '')
        if (await aiNameChecker(emailName as string, name as string)) {
          if (name) {
            student.name = name;
          }
          student.sid_verification = true;
          student.branch = department as string;
          student.student_id = identityNo as string;
          await student.save();

          return NextResponse.json({
            success: true,
            message: 'SID verification completed',
            data: { name: name, department, identityNo },
          });
        } else {
          console.log('else ');
          user.sid_verification = false;
          await user.save();

          return NextResponse.json(
            { success: false, message: 'Name mismatch between email and extracted text' },
            { status: 400 }
          );
        }
      } else {
        user.sid_verification = false;
        await user.save();
        return NextResponse.json(
          { success: false, message: 'Failed to extract text from image' },
          { status: 500 }
        );
      }
    } else {
      
      return NextResponse.json(
        { success: false, message: 'SID verification already completed' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error verifying user:', error);
    return NextResponse.json(
      { success: false, message: 'Error verifying user' },
      { status: 500 }
    );
  }
}