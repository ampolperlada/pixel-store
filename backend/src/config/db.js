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
  log: ['info', 'warn', 'error']
});

// PostgreSQL Connection
export const connectPostgres = async () => {
  let retries = 5;
  while (retries > 0) {
    try {
      await prisma.$connect();
      console.log("✅ PostgreSQL Connected!");
      return;
    } catch (error) {
      retries--;
      console.error(`❌ Connection failed (${retries} retries left):`, error);
      if (retries === 0) {
        console.error("💥 Failed to connect to PostgreSQL");
        process.exit(1);
      }
      await new Promise(res => setTimeout(res, 2000));
    }
  }
};

// MongoDB Connection - Modern version
export const connectMongoDB = async () => {
  const mongoUri = process.env.MONGO_URI;  if (!mongoUri) {
    console.error("❌ MongoDB URI not found");
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
      retryWrites: true,
      w: 'majority'
    });
    
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log("✅ MongoDB Connected! Collections:", collections.map(c => c.name));
    
    mongoose.connection.on('error', err => {
      console.error('MongoDB error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected! Reconnecting in 5s...');
      setTimeout(connectMongoDB, 5000);
    });

    await mongoose.connection.db.admin().ping();
    console.log("🏓 MongoDB Ping Successful");

  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error);
    process.exit(1);
  }
};

export const connectDatabases = async () => {
  try {
    await Promise.all([
      connectPostgres(),
      connectMongoDB()
    ]);
    console.log("✅ All databases connected");
  } catch (error) {
    console.error("💥 Database connection failed:", error);
    process.exit(1);
  }
};

export const shutdown = async () => {
  try {
    await Promise.all([
      prisma.$disconnect(),
      mongoose.connection.close()
    ]);
    console.log("🛑 Databases disconnected");
  } catch (error) {
    console.error("Shutdown error:", error);
  }
};

export default prisma;