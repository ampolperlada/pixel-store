import mongoose from "mongoose";
import prisma from "./prisma.js"; // Import your existing Prisma client
import dotenv from "dotenv";

dotenv.config();

export const connectPostgres = async () => {
  try {
    await prisma.$connect();
    console.log("✅ PostgreSQL Connected!");
  } catch (error) {
    console.error("❌ PostgreSQL Connection Failed:", error);
    process.exit(1);
  }
};

export const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { 
      useNewUrlParser: true, 
      useUnifiedTopology: true 
    });
    console.log("✅ MongoDB Connected!");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error);
    process.exit(1);
  }
};

// Call these functions in your server startup
export const connectDatabases = async () => {
  await connectPostgres();
  await connectMongoDB();
};

export default prisma; // Also export the prisma client for use elsewhere