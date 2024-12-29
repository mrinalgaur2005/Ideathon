import dbConnect from "../../../lib/connectDb";
import {authOptions} from "../(auth)/auth/[...nextauth]/options";
import {QdrantClient} from '@qdrant/js-client-rest';
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import {getServerSession, User} from "next-auth";
import {Student, StudentModel, aiChatBotModel} from "../../../model/User";
import { ObjectId } from "bson";

const client = new QdrantClient({
    url: process.env.QDRANT_URL,
    apiKey: process.env.QDRANT_API_KEY,
});

// Helper function to classify queries
const classifyQuery = (query: string): string => {
    const marksKeywords = ['marks', 'exam', 'quiz', 'midsem', 'endsem', 'practical', 'score', 'result'];
    const eventsKeywords = ['event', 'club', 'workshop', 'fest', 'competition', 'seminar'];
    const generalKeywords = ['information', 'college', 'timing', 'library', 'administration', 'contact'];
  
    const fuzzyMatch = (keywords: string[], query: string): boolean => {
      return keywords.some((keyword) => query.toLowerCase().includes(keyword));
    };
  
    if (fuzzyMatch(marksKeywords, query)) return 'marks';
    if (fuzzyMatch(eventsKeywords, query)) return 'events';
    if (fuzzyMatch(generalKeywords, query)) return 'general';
  
    return 'unknown';
};

// Helper functions to get data
const getEventText = (eventInfo: any): string => {
    const events = eventInfo?.Info?.events || [];
    if (!events.length) return 'No events found.';
  
    return events
      .map((event: any, i: number) => `Event ${i + 1}:
  Title: ${event.title || 'N/A'}
  Description: ${event.description || 'N/A'}\n`)
      .join('\n');
  };
  
  const getMarksText = (marksInfo: any): string => {
    const marks = marksInfo?.Info?.marks || [];
    if (!marks.length) return 'No marks information found.';
  
    return marks
      .map((mark: any, i: number) => `Subject ${i + 1}:
  Subject Code and Name: ${mark.subject || 'N/A'}
  Marks: ${mark.marks || 'N/A'}\n`)
      .join('\n');
  };
  
  const getGeneralText = (generalInfo: any): string => {
    const general = generalInfo?.Info?.general || [];
    if (!general.length) return 'No general information found.';
  
    return general
      .map((info: any, i: number) => `Info ${i + 1}:
  Title: ${info.subject || 'N/A'}
  Description: ${info.description || 'N/A'}\n`)
      .join('\n');
  };


export async function POST(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !user) {
      return NextResponse.json({ error: 'Unauthorized. User must be logged in.' }, { status: 401 });
    }

    const userId = new mongoose.Types.ObjectId(user._id);

    const student: Student|null = await StudentModel.findOne({user_id: userId});

    if (!student) {
      return new Response(
        JSON.stringify({ success: false, message: 'student not found' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const requestBody = await request.json();
    const userInput = requestBody.userInput;
    const classifiedQuery = classifyQuery(userInput);

    let info;
    let text;

    switch (classifiedQuery) {
      case 'events':
        info = await aiChatBotModel.findById(new ObjectId('676d8bf49e48cdfb0b216f3f'));
        text = getEventText(info);
        break;
      case 'marks':
        info = await aiChatBotModel.findById(new ObjectId('676da65f9e48cdfb0b216f48'));
        text = getMarksText(info);
        break;
      case 'general':
        info = await aiChatBotModel.findById(new ObjectId('676da9b09e48cdfb0b216f49'));
        text = getGeneralText(info);
        break;
      default:
        text = 'Sorry, I could not understand your query.';
    }

    return new Response(
      JSON.stringify({ success: true, message: text }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
}
