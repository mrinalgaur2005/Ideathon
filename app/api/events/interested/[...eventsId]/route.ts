import { NextResponse } from "next/server";
import dbConnect from "../../../../../lib/connectDb";
import { EventModel,StudentModel } from "../../../../../model/User";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../../../(auth)/auth/[...nextauth]/options";
import mongoose from "mongoose";


export async function PATCH(
    req:Request,
    {params}:{params:{eventId:string}}
) {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);
        const user: User = session?.user as User;
        
        if (!session || !user) {
            return NextResponse.json({ error: 'Unauthorized. User must be logged in.' }, { status: 401 });
        }
        
        const eventId = params.eventId;
        if (!eventId) {
            return NextResponse.json({ error: "Event ID is required." }, { status: 400 });
        }

        const eventObjectId = new mongoose.Types.ObjectId(eventId);
        const userId = new mongoose.Types.ObjectId(user._id);

        const event = await EventModel.findById(eventObjectId);
        if (!event) {
            return NextResponse.json({ error: "Event not found." }, { status: 404 });
        }

        const student = await StudentModel.findOne({ user_id: userId });

        if (!student) {
            return NextResponse.json({ error: "Student not found." }, { status: 404 });
        }

        const alreadyInterested = event.interestedMembersArr.includes(student._id as mongoose.Schema.Types.ObjectId);

        if (alreadyInterested) {
            event.interestedMembersArr.filter((id) => id != student._id);
            student.interestedEvents.filter((id) => id != event._id);
            await event.save();
            await student.save();

            return NextResponse.json(
              { success: true, message: "Interest removed successfully.", event, student },
              { status: 200 }
            );
        }

        event.interestedMembersArr.push(student._id as mongoose.Schema.Types.ObjectId) ;
        student.interestedEvents.push((event._id)as mongoose.Schema.Types.ObjectId);
        
        await event.save();
        await student.save();

        return NextResponse.json(
            { success: true, message: "Interest marked successfully.", event, student },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error in PATCH /interested/:eventId:", error);
        return NextResponse.json({ error: "Internal server error." }, { status: 500 });
    }
}