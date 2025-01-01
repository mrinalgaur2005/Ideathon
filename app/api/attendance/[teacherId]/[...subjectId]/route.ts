import dbConnect from "../../../../../lib/connectDb";
import { authOptions } from "../../../(auth)/auth/[...nextauth]/options";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { StudentModel } from "../../../../../model/User";
import mongoose from "mongoose";

export async function GET(request: Request) {
////// Yahan Get likhna hai pura
}