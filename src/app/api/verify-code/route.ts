import { NextRequest, NextResponse } from 'next/server';
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(request: NextRequest) {
    // Connect to the database
    await dbConnect();

    try {
        // Extract the username and verification code from the request body
        const { username, code } = await request.json();
        
        // Decode the username if it was URL encoded
        const decodedUsername = decodeURIComponent(username);
        
        // Find the user by username
        const user = await UserModel.findOne({ username: decodedUsername });

        // Check if user exists
        if (!user) {
            console.log("no user");
            return NextResponse.json({
                success: false,
                message: 'User not found'
            }, { status: 400 });
        }

        // Validate the code and check if it's expired
        const isCodeValid = user.verifyCode === code;
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

        if (isCodeValid && isCodeNotExpired) {
            // Mark the user as verified and save
            user.isVerified = true;
            await user.save();

            return NextResponse.json({
                success: true,
                message: 'Account successfully verified'
            }, { status: 200 });
        } else if (!isCodeValid) {
            console.log("invalid code")
            return NextResponse.json({
                success: false,
                message: 'Invalid verification code'
            }, { status: 400 });
        } else {
            console.log("code is expired")
            return NextResponse.json({
                success: false,
                message: 'Code is expired. Please generate a new one'
            }, { status: 400 });
        }
    } catch (error) {
        console.error('Error verifying user', error);
        return NextResponse.json({
            success: false,
            message: 'Error verifying user'
        }, { status: 500 });
    }
}
