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

// MongoDB Connection - Production-ready version
export const connectMongoDB = async () => {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error("❌ MongoDB URI not found");
    process.exit(1);
  }

  // Configure mongoose settings
  mongoose.Promise = global.Promise;
  mongoose.set('bufferCommands', false);
  mongoose.set('bufferTimeoutMS', 30000);
  mongoose.set('strictQuery', true);

  // Connection options
  const options = {
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 30000,
    maxPoolSize: 10,
    minPoolSize: 2,
    retryWrites: true,
    w: 'majority',
    retryReads: true
  };

  // TLS configuration for production
  if (!mongoUri.includes('localhost')) {
    options.tls = true;
    options.tlsAllowInvalidCertificates = process.env.NODE_ENV !== 'production';
  }

  try {
    // Close existing connection if exists
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }

    await mongoose.connect(mongoUri, options);
    
    console.log("✅ MongoDB Connected!");
    
    // Event handlers
    mongoose.connection.on('connected', () => {
      console.log('MongoDB connection established');
    });

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected! Attempting to reconnect...');
      setTimeout(() => connectMongoDB(), 5000);
    });

    // Verify connection
    await mongoose.connection.db.admin().ping();
    console.log("🏓 MongoDB Ping Successful");

  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error);
    setTimeout(() => connectMongoDB(), 5000);
  }
};

export const shutdown = async () => {
  try {
    await Promise.all([
      prisma.$disconnect().catch(err => console.error("Prisma disconnect error:", err)),
      mongoose.connection.close().catch(err => console.error("MongoDB disconnect error:", err))
    ]);
    console.log("🛑 Databases disconnected gracefully");
  } catch (error) {
    console.error("Shutdown error:", error);
  }
};

export default prisma;