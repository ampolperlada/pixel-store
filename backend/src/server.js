import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { connectPostgres, connectMongoDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import nftRoutes from "./routes/nftRoutes.js";
import gameRoutes from "./routes/gameRoutes.js";
import errorHandler from "./middleware/errorMiddleware.js";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { Server } from "socket.io";

// ES Module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from backend root (where package.json is)
dotenv.config({ path: path.resolve(__dirname, "../.env") });
console.log("DB URL:", process.env.DATABASE_URL); // Test logging

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Create HTTP server using the Express app
const httpServer = createServer(app);

// Initialize Socket.IO with the HTTP server
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Security & Middleware
app.use(cors({ 
  origin: process.env.CLIENT_URL || "http://localhost:3000", 
  credentials: true 
}));
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use("/api/", apiLimiter);

// Connect to databases
(async () => {
  await connectPostgres();
  await connectMongoDB();
})();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/nfts", nftRoutes);
app.use("/api/games", gameRoutes);

// Add trending collections API endpoint
app.get("/api/collections/trending", async (req, res) => {
  const period = req.query.period || '1d';
  
  try {
    const trendingData = await fetchTrendingData(period);
    res.json(trendingData);
  } catch (error) {
    console.error('Error fetching trending data:', error);
    res.status(500).json({ error: 'Failed to fetch trending data' });
  }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "healthy" });
});

// Error handling middleware
app.use(errorHandler);

// Handle 404
app.use((req, res) => {
  res.status(404).json({ message: "Not Found" });
});

// Store active socket subscriptions
const activeSubscriptions = new Map();

// Socket.IO connection handler
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  // Handle subscription requests
  socket.on("subscribe", (period) => {
    // Remove previous subscription if any
    const prevPeriod = activeSubscriptions.get(socket.id);
    if (prevPeriod) {
      socket.leave(prevPeriod);
    }
    
    // Add to new subscription room
    socket.join(period);
    activeSubscriptions.set(socket.id, period);
    
    console.log(`Client ${socket.id} subscribed to ${period}`);
    
    // Send initial data for the requested period
    fetchTrendingData(period)
      .then(data => {
        socket.emit("trendingUpdate", data);
      })
      .catch(err => {
        console.error(`Error sending initial data to client ${socket.id}:`, err);
      });
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    activeSubscriptions.delete(socket.id);
    console.log("Client disconnected:", socket.id);
  });
});

// Function to emit updates to subscribed clients
const emitTrendingUpdate = async (period) => {
  try {
    const trendingData = await fetchTrendingData(period);
    io.to(period).emit("trendingUpdate", trendingData);
    console.log(`Emitted trending update for period: ${period}`);
  } catch (error) {
    console.error('Error emitting trending update:', error);
  }
};

// Function to fetch trending data (replace with your actual implementation)
async function fetchTrendingData(period) {
  // TODO: Replace with actual database query or API call
  // This is just mock data for demonstration
  
  // You should implement this to fetch from your PostgreSQL or MongoDB database
  // Example: const result = await db.query('SELECT * FROM trending_collections WHERE period = $1', [period]);
  
  return [
    {
      id: '1',
      name: 'Bored Ape Yacht Club',
      floorPrice: 12.5,
      floorChange: 2.3,
      volume: 150.75,
      volumeChange: 5.6,
      items: 10000,
      owners: 6500,
      isVerified: true
    },
    {
      id: '2',
      name: 'CryptoPunks',
      floorPrice: 30.2,
      floorChange: -1.5,
      volume: 200.4,
      volumeChange: -3.2,
      items: 10000,
      owners: 3100,
      isVerified: true
    },
    {
      id: '3',
      name: 'Azuki',
      floorPrice: 8.7,
      floorChange: 4.2,
      volume: 95.3,
      volumeChange: 10.8,
      items: 10000,
      owners: 5200,
      isVerified: true
    },
    {
      id: '4',
      name: 'Doodles',
      floorPrice: 5.1,
      floorChange: 0.8,
      volume: 45.6,
      volumeChange: 2.1,
      items: 10000,
      owners: 4800,
      isVerified: true
    },
    {
      id: '5',
      name: 'CloneX',
      floorPrice: 4.3,
      floorChange: -0.5,
      volume: 38.7,
      volumeChange: -1.2,
      items: 20000,
      owners: 8900,
      isVerified: true
    }
  ];
}

// Set up periodic updates (every minute)
setInterval(() => {
  const periods = ['1h', '1d', '7d', '30d'];
  periods.forEach(period => {
    // Only emit if there are active subscribers
    if ([...activeSubscriptions.values()].includes(period)) {
      emitTrendingUpdate(period);
    }
  });
}, 60000); // 60000 ms = 1 minute

// Start server with the HTTP server (not the Express app directly)
const server = httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`Socket.IO initialized and ready for connections`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  server.close(() => process.exit(1));
});

export const connectMongoDB = async () => {
  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!mongoUri) {
    console.error("❌ MongoDB connection string not found in environment variables");
    process.exit(1);
  }

  try {
    // Updated connection options (removed deprecated ones)
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
      retryWrites: true,
      w: 'majority',
      retryReads: true,  // Added for better read resilience
      connectTimeoutMS: 10000,  // Increased connection timeout
      socketTimeoutMS: 45000  // Increased socket timeout
    });
    
    // Verify connection
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log("✅ MongoDB Connected! Available collections:", collections.map(c => c.name));
    
    // Improved event handlers
    mongoose.connection.on('error', err => {
      console.error('MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected! Attempting to reconnect...');
      setTimeout(connectMongoDB, 5000); // Wait 5 seconds before reconnecting
    });

    // Ping verification
    await mongoose.connection.db.admin().ping();
    console.log("🏓 MongoDB Ping Successful - Connection is healthy");

  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error);
    process.exit(1);
  }
};