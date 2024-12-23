import dbConnect from "../../../../lib/connectDb";
import {getServerSession, User} from "next-auth";
import {authOptions} from "../../(auth)/auth/[...nextauth]/options";
import {NextResponse} from "next/server";
import mongoose from "mongoose";

export async function GET(req: Request) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !user) {
      return NextResponse.json({error: 'Unauthorized. User must be logged in.'}, {status: 401});
    }

    const userId = new mongoose.Types.ObjectId(user._id);

  } catch (error) {
    console.error('Error fetching event:', error);
    return new Response(
      JSON.stringify({success: false, message: 'Server error', error: error}),
      {status: 500, headers: {'Content-Type': 'application/json'}}
    );
  }
}
