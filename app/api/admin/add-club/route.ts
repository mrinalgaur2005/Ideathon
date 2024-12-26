import {NextRequest, NextResponse} from "next/server";
import dbConnect from "../../../../lib/connectDb";
import {getServerSession, User} from "next-auth";
import {authOptions} from "../../(auth)/auth/[...nextauth]/options";
import mongoose from "mongoose";
import {ClubModel} from "../../../../model/User";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !user) {
      return NextResponse.json({ error: 'Unauthorized. User must be logged in.' }, { status: 401 });
    }

    const {clubName, clubLogo, clubIdSecs, clubMembers} = await req.json();

    if (!clubName) {
      return NextResponse.json(
        { error: 'ClubName is required' },
        { status: 403 }
      );
    }

    const club = await ClubModel.create({
      clubName,
      clubLogo,
      clubIdSecs,
      clubMembers,
      clubEvents: []
    })

    if (!club) {
      return NextResponse.json(
        { error: 'Failed to create club' },
        { status: 500 }
      );
    }

    return NextResponse.json(club, {status: 200});

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}