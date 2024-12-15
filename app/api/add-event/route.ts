import { NextResponse } from "next/server";
import dbConnect from "../../../lib/connectDb";

export async function POST(req:Request){
    await dbConnect();
    const {
        eventHostedBy,
        eventVenue,
        eventTime,
        interestedMembersArr,
        eventAttachments,
        heading,
        description,
        tags,
    } = await req.json();
    try {
        

        
    } catch (error) {
        console.log("EVENT_POST ", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}