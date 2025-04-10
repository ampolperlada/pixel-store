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
  let retries = 5; // Increased from 3 to 5 for more resilience
  while (retries > 0) {
    try {
      await prisma.$connect();
      console.log("✅ PostgreSQL Connected!");
      return;
    } catch (error) {
      retries--;
      console.error(`❌ Connection failed (${retries} retries left):`, error);
      if (retries === 0) {
        console.error("💥 Failed to connect to PostgreSQL after multiple attempts");
        process.exit(1);
      }
      await new Promise(res => setTimeout(res, 2000)); // Wait 2 seconds
    }
  }
};

// MongoDB Connection - Enhanced version
// MongoDB Connection - Enhanced with verification
export const connectMongoDB = async () => {
  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!mongoUri) {
    console.error("❌ MongoDB connection string not found in environment variables");
    process.exit(1);
  }

  try {
    // Connection with more options and verification
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000, // 5 seconds timeout
      retryWrites: true,
      w: 'majority',
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    // Verify connection by checking collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log("✅ MongoDB Connected! Available collections:", collections.map(c => c.name));
    
    // Event handlers
    mongoose.connection.on('error', err => {
      console.error('MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected! Attempting to reconnect...');
      connectMongoDB(); // Auto-reconnect
    });

    // Additional verification - ping the database
    await mongoose.connection.db.admin().ping();
    console.log("🏓 MongoDB Ping Successful - Connection is healthy");

  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error);
    process.exit(1);
  }
};

// Combined connection with better error handling
export const connectDatabases = async () => {
  try {
    await Promise.allSettled([
      connectPostgres(),
      connectMongoDB()
    ]);
    console.log("✅ All databases connected successfully");
  } catch (error) {
    console.error("💥 Failed to connect to one or more databases:", error);
    process.exit(1);
  }
};

// Graceful shutdown handler
export const shutdown = async () => {
  try {
    await Promise.allSettled([
      prisma.$disconnect(),
      mongoose.connection.close()
    ]);
    console.log("🛑 Databases disconnected gracefully");
  } catch (error) {
    console.error("Error during shutdown:", error);
  }
};

// Default export
export default prisma;