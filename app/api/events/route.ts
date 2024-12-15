import dbConnect from "../../../lib/connectDb";
import { EventModel } from "../../../model/User";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
      await dbConnect();
      const url = new URL(request.url);
      const genre = url.searchParams.get('genre');
      const date = url.searchParams.get('date'); //
      const query: any = {};
  
      if (genre) {
        query.genre = genre; 
      }
      
      
      if (date) {
          const parsedDate = new Date(date);
          if (isNaN(parsedDate.getTime())) {
              return NextResponse.json({ error: 'Invalid date format' }, { status: 400 });
            }
            query.date = {
                $gte: parsedDate,
            };
        }
        console.log(query);
      const events = await EventModel.find(query).exec();
      return NextResponse.json({ data: events }, { status: 200 });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: 'An error occurred while fetching events.' }, { status: 500 });
    }
  }