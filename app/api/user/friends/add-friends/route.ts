import dbConnect from "../../../../../lib/connectDb";
import {getServerSession, User} from "next-auth";
import {authOptions} from "../../../(auth)/auth/[...nextauth]/options";
import {NextResponse} from "next/server";
import mongoose from "mongoose";
import {StudentModel} from "../../../../../model/User";

export async function GET() {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !user) {
      return NextResponse.json({ error: 'Unauthorized. User must be logged in.' }, { status: 401 });
    }

    const userId = new mongoose.Types.ObjectId(user._id);

    const student = await StudentModel.findOne({user_id: userId});

    if (!student) {
      return NextResponse.json(
        { error: 'Unauthorized. User does not exist.' },
        {status: 401}
      )
    }

    const students = await StudentModel.aggregate([
      {
        $match: {
          _id: { $nin: [...student.friends, student._id]}
        }
      },
      {
        $project: {
          name: 1,
          student_id: 1,
          profile: 1
        }
      }
    ])

    if (!students || students.length === 0) {
      return NextResponse.json(
        { error: 'Students not found.' },
        {status: 404}
      )
    }

    return NextResponse.json({students, id: student._id}, { status: 200 })
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'An error occurred while fetching students.' }, { status: 500 });
  }
}