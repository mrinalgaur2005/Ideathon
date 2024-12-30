import dbConnect from "../../../lib/connectDb";
import { authOptions } from "../(auth)/auth/[...nextauth]/options";
import { QdrantClient } from '@qdrant/js-client-rest';
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { getServerSession, User } from "next-auth";
import { Student, StudentModel, aiChatBotModel } from "../../../model/User";
import { ObjectId } from "bson";
// import { GoogleGenerativeAIEmbeddings } from "@google/generative-ai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { AstraDBVectorStore } from "@langchain/community/vectorstores/astradb";



// Initialize Google Generative AI
if (!process.env.GOOGLE_API_KEY) {
  throw new Error('GOOGLE_API_KEY is not defined');
}

// Initialize Qdrant Client
const qdrantClient = new QdrantClient({
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

// Check if collection exists before creating
const collectionExists = async (qdrantClient: QdrantClient, collectionName: string) => {
  try {
    const response = await qdrantClient.getCollection(collectionName);
    return !!response; // If the collection exists, return true
  } catch (error) {
    if ((error as any).response?.status === 404) {
      return false; // Collection does not exist
    }
    throw error; // Re-throw other errors
  }
};

const createVectorStore = async (
  text: string,
  qdrantClient: QdrantClient,
  collectionName: string,
) => {
  try {
    const embeddings = new GoogleGenerativeAIEmbeddings({
      apiKey: process.env.GOOGLE_API_KEY,
      model: "text-embedding-004",
    });

    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    // Split the text into chunks
    const documentTexts = await textSplitter.splitText(text);
    
    // Get embeddings
    const embeds = await Promise.all(documentTexts.map((text) => embeddings.embedQuery(text)));
    
    // Check if collection exists
    const exists = await collectionExists(qdrantClient, collectionName);
    if (!exists) {
      const vectorSize = embeds[0]?.length || 768;
      await qdrantClient.createCollection(collectionName, {
        vectors: {
          size: vectorSize,
          distance: 'Cosine',
        },
        optimizers_config: {
          default_segment_number: 2,
        },
        replication_factor: 2,
      });
    }

    // Create points with numeric IDs and clean payload
    const points = documentTexts.map((text, i) => ({
      id: i,  // Using number instead of string
      vector: Array.from(embeds[i]),  // Ensure vector is a regular array
      payload: {
        text: text.trim(),  // Clean the text
      }
    }));

    // Upsert points in batches of 100
    const batchSize = 100;
    for (let i = 0; i < points.length; i += batchSize) {
      const batch = points.slice(i, i + batchSize);
      try {
        await qdrantClient.upsert(collectionName, {
          points: batch,
          wait: true
        });
        console.log(`Successfully uploaded batch ${i / batchSize + 1}`);
      } catch (error) {
        console.error('Error in batch upload:', {
          batchNumber: i / batchSize + 1,
          error: error instanceof Error ? error.message : 'Unknown error',
          samplePoint: batch[0]
        });
        throw error;
      }
    }

    return { 
      success: true, 
      message: `Successfully uploaded ${points.length} points to collection ${collectionName}`
    };
  } catch (error) {
    console.error('Error creating vector store:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      collectionName,
      textLength: text.length
    });
    
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'An unknown error occurred'
    };
  }
};


export async function POST(request: Request) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !user) {
      return NextResponse.json(
        { error: 'Unauthorized. User must be logged in.' }, 
        { status: 401 }
      );
    }

    const userId = new mongoose.Types.ObjectId(user._id);
    const student: Student | null = await StudentModel.findOne({ user_id: userId });

    if (!student) {
      return NextResponse.json(
        { success: false, message: 'Student not found' },
        { status: 404 }
      );
    }

    const { userInput } = await request.json();
    const classifiedQuery = classifyQuery(userInput);

    let info;
    let text;
    let vectorStoreResult;

    switch (classifiedQuery) {
      case 'events':
        info = await aiChatBotModel.findById(new ObjectId('676d8bf49e48cdfb0b216f3f'));
        text = getEventText(info);
        vectorStoreResult = await createVectorStore(text, qdrantClient, 'events');
        break;
      case 'marks':
        info = await aiChatBotModel.findById(new ObjectId('676da65f9e48cdfb0b216f48'));
        text = getMarksText(info);
        vectorStoreResult = await createVectorStore(text, qdrantClient, 'marks');
        break;
      case 'general':
        info = await aiChatBotModel.findById(new ObjectId('676da9b09e48cdfb0b216f49'));
        text = getGeneralText(info);
        vectorStoreResult = await createVectorStore(text, qdrantClient, 'general');
        break;
      default:
        text = 'Sorry, I could not understand your query.';
        vectorStoreResult = { success: true, response: text };
    }

    if (!vectorStoreResult.success) {
      return NextResponse.json(
        { success: false, error: vectorStoreResult.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, response: text });
  } catch (error) {
    console.error('Error in POST route:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      },
      { status: 500 }
    );
  }
}
