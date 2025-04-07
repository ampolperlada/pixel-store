import mongoose from "mongoose";
import { PrismaClient } from '@prisma/client';
import dotenv from "dotenv";

dotenv.config();

// Initialize Prisma with Session Pooler settings
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL + "&connection_limit=5" // Optimized for pooler
    }
  },
  log: process.env.NODE_ENV === 'development' ? ['query'] : []
});

export const connectPostgres = async () => {
  try {
    await prisma.$connect();
    console.log("✅ PostgreSQL (Prisma + Session Pooler) Connected!");
  } catch (error) {
    console.error("❌ PostgreSQL Connection Failed:", error);
    process.exit(1);
  }
};

export const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000 // Faster failover
    });
    console.log("✅ MongoDB Connected!");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error);
    process.exit(1);
  }
};

// Unified connection handler
export const connectDatabases = async () => {
  await Promise.allSettled([
    connectPostgres(),
    connectMongoDB()
  ]);
};

export { prisma };