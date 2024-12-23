import dbConnect from "../../../../lib/connectDb";
import {getServerSession, User} from "next-auth";
import {authOptions} from "../../(auth)/auth/[...nextauth]/options";
import {NextResponse} from "next/server";
import mongoose from "mongoose";
import {MarksModel, StudentModel} from "../../../../model/User";

export async function GET(req: Request) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !user) {
      return NextResponse.json({error: 'Unauthorized. User must be logged in.'}, {status: 401});
    }

    const userId = new mongoose.Types.ObjectId(user._id);

    const profile = await StudentModel.aggregate([
      {
        $match: {
          user_id: userId
        }
      },
      {
        $lookup: {
          from: "clubs",
          localField: "clubsPartOf",
          foreignField: "_id",
          as: "clubsPartOf",
          pipeline: [
            {
              $project: {
                clubName: 1,
                clubLogo: 1,
              }
            }
          ]
        }
      },
      {
        $lookup: {
          from: "marks", // Collection where Marks data is stored
          pipeline: [
            {
              $project: {
                subjects: {
                  $objectToArray: "$subjects", // Convert 'subjects' Map to an array of key-value pairs
                },
              },
            },
          ],
          as: "marksData",
        },
      },
      {
        $unwind: "$marksData", // Unwind the marks data
      },
      {
        $unwind: "$marksData.subjects", // Unwind the subjects array
      },
      {
        $match: {
          "marksData.subjects.k": { $in: "$enrolledSubjectId" }, // Match subjectId with enrolledSubjectId
        },
      }
    ])

    if (!profile || profile.length == 0) {
      return new Response(
        JSON.stringify({success: false, message: "profile not found"}),
        {status: 404, headers: {'Content-Type': 'application/json'}}
      );
    }

    console.log(profile);
    return new Response(
      JSON.stringify({success: true, data: profile[0]}),
      {status: 200, headers: {'Content-Type': 'application/json'}}
    );

  } catch (error) {
    console.error('Error fetching event:', error);
    return new Response(
      JSON.stringify({success: false, message: 'Server error', error: error}),
      {status: 500, headers: {'Content-Type': 'application/json'}}
    );
  }
}
