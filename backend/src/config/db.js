import mongoose from "mongoose";
import { PrismaClient } from '@prisma/client';
import dotenv from "dotenv";

dotenv.config();

// Initialize Prisma
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  },
  log: ['info', 'warn', 'error'] // Better debugging
});

// PostgreSQL Connection
export const connectPostgres = async () => {
  try {
    await prisma.$connect();
    console.log("✅ PostgreSQL Connected!");
  } catch (error) {
    console.error("❌ PostgreSQL Connection Failed:", error);
    process.exit(1);
  }
};

// MongoDB Connection
export const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000
    });
    console.log("✅ MongoDB Connected!");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error);
    process.exit(1);
  }
};

// Combined connection (optional)
export const connectDatabases = async () => {
  await Promise.allSettled([
    connectPostgres(),
    connectMongoDB()
  ]);
};

// Default export
export default prisma;