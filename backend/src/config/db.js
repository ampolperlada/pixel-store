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

// Connection state tracking
const dbState = {
  mongo: {
    connected: false,
    retryCount: 0,
    maxRetries: 5
  },
  postgres: {
    connected: false
  }
};

// PostgreSQL Connection - Enhanced with state tracking
export const connectPostgres = async () => {
  let retries = 5;
  while (retries > 0) {
    try {
      if (!dbState.postgres.connected) {
        await prisma.$connect();
        dbState.postgres.connected = true;
        console.log("✅ PostgreSQL Connected!");
      }
      return;
    } catch (error) {
      dbState.postgres.connected = false;
      retries--;
      console.error(`❌ PostgreSQL connection failed (${retries} retries left):`, error);
      if (retries === 0) {
        console.error("💥 Failed to connect to PostgreSQL");
        throw error;
      }
      await new Promise(res => setTimeout(res, 2000));
    }
  }
};

// MongoDB Connection - Production-ready with enhanced stability
export const connectMongoDB = async () => {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error("❌ MongoDB URI not found");
    throw new Error("MongoDB URI not configured");
  }

  // Skip if already connected
  if (mongoose.connection.readyState === 1) {
    dbState.mongo.connected = true;
    return;
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
    // Close any existing connection
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }

    await mongoose.connect(mongoUri, options);
    dbState.mongo.connected = true;
    dbState.mongo.retryCount = 0;
    console.log("✅ MongoDB Connected!");

    // Event handlers
    mongoose.connection.on('connected', () => {
      dbState.mongo.connected = true;
      console.log('MongoDB connection established');
    });

    mongoose.connection.on('error', (err) => {
      dbState.mongo.connected = false;
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      dbState.mongo.connected = false;
      console.warn('MongoDB disconnected! Attempting to reconnect...');
      if (dbState.mongo.retryCount < dbState.mongo.maxRetries) {
        dbState.mongo.retryCount++;
        setTimeout(() => connectMongoDB(), 5000);
      }
    });

    // Verify connection with a lightweight operation
    await mongoose.connection.db.command({ ping: 1 });
    console.log("🏓 MongoDB Ping Successful");

  } catch (error) {
    dbState.mongo.connected = false;
    console.error("❌ MongoDB Connection Failed:", error);
    
    if (dbState.mongo.retryCount < dbState.mongo.maxRetries) {
      dbState.mongo.retryCount++;
      console.log(`Retrying MongoDB connection (attempt ${dbState.mongo.retryCount})`);
      setTimeout(() => connectMongoDB(), 5000);
    } else {
      throw error;
    }
  }
};

// Health check function
export const checkDatabaseHealth = async () => {
  try {
    await Promise.all([
      prisma.$queryRaw`SELECT 1`,
      mongoose.connection.db.command({ ping: 1 })
    ]);
    return {
      postgres: true,
      mongodb: true,
      status: 'healthy'
    };
  } catch (error) {
    return {
      postgres: dbState.postgres.connected,
      mongodb: dbState.mongo.connected,
      status: 'degraded',
      error: error.message
    };
  }
};

// Graceful shutdown
export const shutdown = async () => {
  try {
    await Promise.allSettled([
      prisma.$disconnect().then(() => {
        dbState.postgres.connected = false;
        console.log("🛑 PostgreSQL disconnected");
      }),
      mongoose.connection.close().then(() => {
        dbState.mongo.connected = false;
        console.log("🛑 MongoDB disconnected");
      })
    ]);
    console.log("✅ Databases disconnected gracefully");
  } catch (error) {
    console.error("Shutdown error:", error);
    throw error;
  }
};

// Connection middleware for Express
export const databaseMiddleware = async (req, res, next) => {
  try {
    await Promise.all([
      connectPostgres(),
      connectMongoDB()
    ]);
    next();
  } catch (error) {
    res.status(503).json({
      error: "Service Unavailable",
      message: "Database connection failed",
      details: error.message
    });
  }
};

export default prisma;