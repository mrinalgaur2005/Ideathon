import mongoose, { Schema, Document } from 'mongoose';

export interface User extends Document {
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    isTeacher: boolean; // Admin-controlled field to mark if the user is a teacher
}

const UserSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: [true, 'username is required'],
        unique: true,
    },
    email: {
        type: String,
        required: [true, 'email is required'],
        unique: true,
        match: [/^[a-zA-Z0-9._%+-]+@pec\.edu\.in$/, 'please use college email id'],
    },
    password: {
        type: String,
        required: [true, 'password is required'],
    },
    verifyCode: {
        type: String,
        required: [true, 'Verification Code is required'],
    },
    verifyCodeExpiry: {
        type: Date,
        required: [true, 'Expiry is required'],
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    isTeacher: {
        type: Boolean,
        default: false, // Default to false, only true if admin updates the field
    },
});

// Check if the model already exists in mongoose models and only define it if it doesn't
const UserModel =
    mongoose.models.User || mongoose.model<User>('User', UserSchema);

export default UserModel;
