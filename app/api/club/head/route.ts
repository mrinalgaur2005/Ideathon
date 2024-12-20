import dbConnect from "../../../../lib/connectDb";
import {getServerSession, User} from "next-auth";
import {authOptions} from "../../(auth)/auth/[...nextauth]/options";
import {NextResponse} from "next/server";
import {ClubModel} from "../../../../model/User";
import mongoose from "mongoose";

export default async function GET() {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !user) {
      return NextResponse.json({ error: 'Unauthorized. User must be logged in.' }, { status: 401 });
    }

    const userId = new mongoose.Types.ObjectId(user._id);

    const clubsHeadOf = await ClubModel.aggregate([
      {
        $match: {
          clubIdSecs: [userId]
        }
      },
      {
        $project: {
          clubName: 1
        }
      }
    ]);

    if (!clubsHeadOf) {
      return NextResponse.json({error: 'User is not head of any club.'}, {status: 403});
    }

    return NextResponse.json(clubsHeadOf, {status: 200});
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}