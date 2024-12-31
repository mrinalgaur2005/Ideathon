import dbConnect from "../../../lib/connectDb";
import { authOptions } from "../(auth)/auth/[...nextauth]/options";
import { QdrantClient } from '@qdrant/js-client-rest';
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { getServerSession, User } from "next-auth";
import { Student, StudentModel, aiChatBotModel } from "../../../model/User";
import { ObjectId } from "bson";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import Groq from 'groq-sdk';

if (!process.env.GOOGLE_API_KEY || !process.env.QDRANT_URL || !process.env.QDRANT_API_KEY) {
  throw new Error('Required environment variables are not defined');
}

const groqClient = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const qdrantClient = new QdrantClient({
  url: process.env.QDRANT_URL,
  apiKey: process.env.QDRANT_API_KEY,
});

const embeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: process.env.GOOGLE_API_KEY,
  model: "text-embedding-004",
});

// Helper function to classify queries
const classifyQuery = (query: string): string => {
  const queryLower = query.toLowerCase();
  const categories = {
    marks: ['marks', 'exam', 'quiz', 'midsem', 'endsem', 'practical', 'score', 'result', 'grade'],
    events: ['event', 'club', 'workshop', 'fest', 'competition', 'seminar', 'meetup'],
    general: ['information', 'college', 'timing', 'library', 'administration', 'contact', 'schedule', 'chat', 'help', 'bot', 'assistant', 'chatbot']
  };

  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some(keyword => queryLower.includes(keyword))) {
      return category;
    }
  }
  return 'general';
};

const ensureCollection = async (
  collectionName: string,
  vectorSize: number
): Promise<void> => {
  if (!collectionName || !vectorSize) {
    throw new Error('Collection name and vector size are required');
  }

  const maxRetries = 3;
  let currentTry = 0;

  while (currentTry < maxRetries) {
    try {
      // Check if collection exists
      try {
        const collection = await qdrantClient.getCollection(collectionName);
        console.log(`Collection ${collectionName} exists with config:`, collection);
        
        // Validate vector size matches
        if (!collection.config.params.vectors || collection.config.params.vectors.size === undefined || collection.config.params.vectors.size !== vectorSize) {
          throw new Error(`Vector size mismatch. Expected: ${vectorSize}, Got: ${collection.config.params.vectors?.size}`);
        }
        return;
      } catch (error: any) {
        // Only proceed with creation if collection doesn't exist
        if (error.status !== 404) {
          throw error;
        }
      }

      // Collection doesn't exist, create it
      const collectionConfig = {
        vectors: {
          size: vectorSize,
          distance: 'Cosine' as const,
        },
        optimizers_config: {
          default_segment_number: 2,
        },
        replication_factor: 2,
        write_consistency_factor: 1, // Add this for better write consistency
      };

      await qdrantClient.createCollection(collectionName, collectionConfig);
      console.log(`Created new collection: ${collectionName}`);
      
      // Validate collection was created
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait longer
      const newCollection = await qdrantClient.getCollection(collectionName);
      
      if (!newCollection) {
        throw new Error('Collection creation verification failed');
      }
      
      return;
    } catch (error: any) {
      currentTry++;
      console.error(`Attempt ${currentTry}/${maxRetries} failed:`, error);
      
      if (currentTry === maxRetries) {
        throw new Error(`Collection creation failed after ${maxRetries} attempts: ${error.message || 'Unknown error'}`);
      }
      
      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, currentTry) * 1000));
    }
  }
};

// Helper function to validate Qdrant client connection
const validateQdrantConnection = async (): Promise<void> => {
  try {
    // Try to list collections as a connection test
    await qdrantClient.getCollections();
  } catch (error: any) {
    throw new Error(`Failed to connect to Qdrant: ${error.message || 'Unknown error'}`);
  }
};

// Modified createVectorStore with additional validation
const createVectorStore = async (
  text: string,
  collectionName: string
): Promise<void> => {
  // Validate inputs
  if (!text?.trim()) {
    throw new Error('No text provided for vector store creation');
  }

  // Validate Qdrant connection first
  await validateQdrantConnection();

  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  const documentTexts = await textSplitter.splitText(text);
  
  if (!documentTexts.length) {
    throw new Error('No text chunks generated');
  }

  const embeds = await Promise.all(
    documentTexts.map(text => embeddings.embedQuery(text))
  );

  if (!embeds.length || !embeds[0].length) {
    throw new Error('Failed to generate embeddings');
  }

  // Ensure collection exists with correct vector size
  await ensureCollection(collectionName, embeds[0].length);

  // Create points with unique IDs
  const points = documentTexts.map((text, i) => ({
    id: Date.now() + i, // More unique ID strategy
    vector: Array.from(embeds[i]),
    payload: { 
      text: text.trim(),
      timestamp: new Date().toISOString(),
      chunkIndex: i
    }
  }));

  // Upload in smaller batches with retry logic
  const batchSize = 10; // Reduced batch size
  for (let i = 0; i < points.length; i += batchSize) {
    const batch = points.slice(i, i + batchSize);
    let retries = 3;
    while (retries > 0) {
      try {
        await qdrantClient.upsert(collectionName, {
          points: batch,
          wait: true
        });
        console.log(`Successfully uploaded batch ${i/batchSize + 1}/${Math.ceil(points.length/batchSize)}`);
        break;
      } catch (error) {
        retries--;
        console.error(`Batch upload failed, ${retries} retries left:`, error);
        if (retries === 0) throw error;
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
  }
};

// Improved bot response function
const getBotResponse = async (
  userInput: string,
  collectionName: string,
  fallbackResponse: string
): Promise<string> => {
  try {
    const queryEmbed = await embeddings.embedQuery(userInput);
    
    try {
      const searchResults = await qdrantClient.search(collectionName, {
        vector: Array.from(queryEmbed),
        limit: 3,
      });

      if (!searchResults.length) {
        return fallbackResponse;
      }

      const context = searchResults
        .map(hit => hit.payload?.text || '')
        .join(" ");

      const prompt = `You are a helpful academic assistant. Based on this context: "${context}", 
                     please answer this question: "${userInput}". 
                     If the context is about marks, provide only the student's marks, name, roll number, 
                     and subject details. For events, include the hosting club, venue, date/time, 
                     and a brief description (max 100 words).`;

      const completion = await groqClient.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama3-8b-8192',
      });

      return completion.choices[0]?.message?.content || fallbackResponse;
    } catch (error) {
      console.error('Search error:', error);
      return fallbackResponse;
    }
  } catch (error) {
    console.error('Bot response error:', error);
    return fallbackResponse;
  }
};

export async function POST(request: Request) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = new mongoose.Types.ObjectId(session.user._id);
    const student = await StudentModel.findOne({ user_id: userId });

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    const { userInput } = await request.json();
    const category = classifyQuery(userInput);

    const categoryConfig = {
      events: {
        id: '676d8bf49e48cdfb0b216f3f',
        fallback: 'I could not find specific event information. Please try asking about a specific event.',
        getText: (info: any) => info?.Info?.events?.map((e: any) => 
          `Event: ${e.title}\nDescription: ${e.description}`
        ).join('\n') || ''
      },
      marks: {
        id: '676da65f9e48cdfb0b216f48',
        fallback: 'I could not find your marks information. Please specify the subject or exam.',
        getText: (info: any) => info?.Info?.marks?.map((m: any) =>
          `Subject: ${m.subject}\nMarks: ${m.marks}`
        ).join('\n') || ''
      },
      general: {
        id: '676da9b09e48cdfb0b216f49',
        fallback: 'I could not find that specific information. Please try asking a more specific question.',
        getText: (info: any) => info?.Info?.general?.map((g: any) =>
          `${g.subject}: ${g.description}`
        ).join('\n') || ''
      }
    };

    const config = categoryConfig[category as keyof typeof categoryConfig];
    const info = await aiChatBotModel.findById(new ObjectId(config.id));
    
    if (!info) {
      return NextResponse.json(
        { error: 'Information not found' },
        { status: 404 }
      );
    }

    const text = config.getText(info);
    
    try {
      await createVectorStore(text, category);
      const response = await getBotResponse(userInput, category, config.fallback);
      return NextResponse.json( response , { status: 200 });
    } catch (error) {
      console.error('Processing error:', error);
      return NextResponse.json(
        { response: config.fallback },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}