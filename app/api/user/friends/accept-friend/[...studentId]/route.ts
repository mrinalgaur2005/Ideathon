//accept friend request

import dbConnect from "../../../../../../lib/connectDb";
import {getServerSession, User} from "next-auth";
import {authOptions} from "../../../../(auth)/auth/[...nextauth]/options";
import {NextResponse} from "next/server";
import mongoose from "mongoose";
import {FriendRequestModel, Student, StudentModel} from "../../../../../../model/User";

export async function PATCH(req: Request, { params } : { params : { studentId: string[] } } )  {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !user) {
      return NextResponse.json({ error: 'Unauthorized. User must be logged in.' }, { status: 401 });
    }

    const { studentId } = await params;

    if (!studentId || studentId.length < 2) {
      return NextResponse.json(
        {error: "student id not found"},
        {status: 403}
      )
    }

    if (!mongoose.Types.ObjectId.isValid(studentId[0]) || !mongoose.Types.ObjectId.isValid(studentId[1])) {
      return NextResponse.json(
        { error: "student id is not valid" },
        { status: 403 }
      );
    }

    const to = new mongoose.Types.ObjectId(studentId[0]);
    const from = new mongoose.Types.ObjectId(studentId[1]);

    const sentTo: Student|null = await StudentModel.findById(to);
    const sentFrom: Student|null = await StudentModel.findById(from);

    if (!sentFrom || !sentTo) {
      return NextResponse.json(
        {error: "student not found"},
        {status: 404}
      )
    }

    const deleteRequest = await FriendRequestModel.deleteOne({from, to})

    if (!deleteRequest) {
      return NextResponse.json(
        {error: "failed to delete friend request"},
        {status: 500}
      )
    }

    sentTo.friends = [...sentTo.friends, sentFrom._id as mongoose.Schema.Types.ObjectId];
    sentFrom.friends = [...sentFrom.friends, sentTo._id as mongoose.Schema.Types.ObjectId];

    await sentTo.save();
    await sentFrom.save();

    return NextResponse.json(
      {status: 200},
    )
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'An error occurred while accepting request.' }, { status: 500 });
  }
}