import {NextRequest, NextResponse} from "next/server";
import dbConnect from "../../../../../../lib/connectDb";
import {getServerSession, User} from "next-auth";
import {authOptions} from "../../../../(auth)/auth/[...nextauth]/options";
import mongoose from "mongoose";
import {ClubModel} from "../../../../../../model/User";

export async function PATCH(req: NextRequest,     { params }: { params: { clubId: string[] } }) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !user) {
      return NextResponse.json({ error: 'Unauthorized. User must be logged in.' }, { status: 401 });
    }

    if (!user.isAdmin) {
      return NextResponse.json(
        { error: 'User is not admin' },
        { status: 401 }
      );
    }

    const {clubName, clubLogo, clubIdSecs, clubMembers, clubEvents} = await req.json();

    if (!clubName ) {
      return NextResponse.json(
        {error: "ClubName is required"},
        {status: 403}
      );
    }

    const { clubId } = await params;

    if (!clubId.length) {
      return NextResponse.json(
        {error: 'Club ID is required'},
        {status: 403}
      )
    }

    console.log(clubId);

    if (!mongoose.Types.ObjectId.isValid(clubId[0])) {
      return NextResponse.json(
        {error: 'Club ID is invalid'},
        {status: 403}
      )
    }

    const clubObjectId = new mongoose.Types.ObjectId(clubId[0])

    const updatedClub = await ClubModel.findByIdAndUpdate(clubObjectId, {clubName, clubLogo, clubIdSecs, clubMembers, clubEvents});

    if (!updatedClub) {
      return NextResponse.json(
        {error: 'Failed to update clubs'},
        {status: 500}
      )
    }

    return NextResponse.json(updatedClub, {status: 200});

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}