import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: boolean;
};

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    console.log("Already connected to DB");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI || '', {});
    
    connection.isConnected = mongoose.connection.readyState==1; 
    console.log("DB connected");
  } catch (error) {
    console.error("DB connection failed:", error);
    process.exit(1);
  }
}

export default dbConnect;
