import mongoose from "mongoose";
import prisma from "./prisma.js";
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
    await mongoose.connect(process.env.MONGO_URI); // ✅ Removed deprecated options
    console.log("✅ MongoDB Connected!");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error);
    process.exit(1);
  }
};

export const connectDatabases = async () => {
  await connectPostgres();
  await connectMongoDB();
};

export default prisma;