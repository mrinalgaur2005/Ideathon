import dbConnect from "../../../lib/connectDb";
import { EventModel } from "../../../model/User";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
      await dbConnect();
      const url = new URL(request.url);
      const tags = url.searchParams.get('tags');
      const date = url.searchParams.get('date'); //
      const query: any = {};
  
      if (tags) {
        const tagssArray = tags.split(',').map((g) => g.trim());
        query.tags = { $in: tagssArray };
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
      if(events.length === 0){
        return NextResponse.json({ message: 'No events found matching the filters.' }, { status: 200 });
      }
      return NextResponse.json({ data: events }, { status: 200 });

    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: 'An error occurred while fetching events.' }, { status: 500 });
    }
  }