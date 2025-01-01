import {NextRequest, NextResponse} from "next/server";
import dbConnect from "../../../../../lib/connectDb";
import {getServerSession, User} from "next-auth";
import {authOptions} from "../../../(auth)/auth/[...nextauth]/options";
import mongoose from "mongoose";
import {ClubModel, StudentModel} from "../../../../../model/User";

export async function POST(req: NextRequest) {
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

    const {clubName, clubLogo, clubIdSecs, clubMembers} = await req.json();

    if (!clubName || !clubLogo || !clubIdSecs.length) {
      return NextResponse.json(
        { error: 'Data missing' },
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
        { error: 'Failed to create clubs' },
        { status: 500 }
      );
    }

    const secys = await StudentModel.aggregate([
      {
        $match: {
          student_id: {
            $in: clubIdSecs
          }
        }
      },
      {
        $set: {
          clubsHeadOf: {
            $cond: {
              if: { $in: [club._id, "$clubsHeadOf"] },
              then: "$clubsHeadOf",
              else: { $concatArrays: ["$clubsHeadOf", [club._id]] },
            },
          }
        }
      }
    ])

    if (!secys) {
      return NextResponse.json(
        { error: 'Failed to add secy' },
        {status: 500}
      )
    }

    const members = await StudentModel.aggregate([
      {
        $match: {
          student_id: {
            $in: clubMembers,
          }
        }
      },
      {
        $set: {
          clubsPartOf: {
            $cond: {
              if: { $in: [club._id, "$clubsPartOf"] },
              then: "$clubsPartOf",
              else: { $concatArrays: ["$clubsPartOf", [club._id]] },
            },
          }
        }
      }
    ])

    if (!members) {
      return NextResponse.json(
        {error: "failed to add club in members"},
        {status: 500}
      )
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