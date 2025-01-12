import dbConnect from "@/lib/connectDb";
import mongoose from "mongoose";
import { authOptions } from "../../(auth)/auth/[...nextauth]/options";
import { getServerSession, User } from "next-auth";
import { AnnouncementModel, StudentModel, Student } from "@/model/User";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !user) {
      return NextResponse.json({ error: 'Unauthorized. User must be logged in.' }, { status: 401 });
    }

    const userId = new mongoose.Types.ObjectId(user._id);
    console.log("userId", userId);
    const student = await StudentModel.findOne({user_id: userId});

    if (!student) {
      return NextResponse.json(
        { error: 'Unauthorized. User does not exist.' },
        {status: 401}
      )
    }

    const announcements = await AnnouncementModel.find({}).sort({ createdAt: -1 }).limit(10);

    return NextResponse.json({ success: true, announcements });
  } catch (error) {
    console.error("Error fetching announcements:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
