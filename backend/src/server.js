import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { connectPostgres, connectMongoDB, shutdown } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import nftRoutes from "./routes/nftRoutes.js";
import gameRoutes from "./routes/gameRoutes.js";
import errorHandler from "./middleware/errorMiddleware.js";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { Server } from "socket.io";

// Config setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// App initialization
const app = express();
const PORT = process.env.PORT || 5001;
const httpServer = createServer(app);

// Socket.IO setup
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Middleware
app.use(cors({ 
  origin: process.env.CLIENT_URL || "http://localhost:3000", 
  credentials: true 
}));
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());

// Rate limiting
app.use("/api/", rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
}));

// Server instance variable
let server;

// Connection state monitoring
const monitorConnections = () => {
  setInterval(() => {
    const mongoState = mongoose.connection.readyState;
    console.log(`Database Status - PostgreSQL: Connected | MongoDB: ${
      mongoState === 0 ? 'Disconnected' :
      mongoState === 1 ? 'Connected' :
      mongoState === 2 ? 'Connecting' : 'Disconnecting'
    }`);
  }, 60000); // Log every minute
};

// Enhanced cleanup function
const cleanup = async () => {
  console.log("\n🛑 Shutting down gracefully...");
  try {
    if (server) {
      server.close(() => {
        console.log("HTTP server closed");
      });
    }
    await shutdown();
    process.exit(0);
  } catch (err) {
    console.error("Cleanup error:", err);
    process.exit(1);
  }
};

// Database connection and server startup
const startServer = async () => {
  try {
    console.log("⏳ Connecting to databases...");
    
    // Connect to databases first
    await connectPostgres();
    await connectMongoDB();
    
    // Start connection monitoring
    monitorConnections();

    // Routes
    app.use("/api/auth", authRoutes);
    app.use("/api/nfts", nftRoutes);
    app.use("/api/games", gameRoutes);

    // Trending collections endpoint
    app.get("/api/collections/trending", async (req, res) => {
      try {
        const trendingData = await fetchTrendingData(req.query.period || '1d');
        res.json(trendingData);
      } catch (error) {
        console.error('Trending data error:', error);
        res.status(500).json({ error: 'Failed to fetch trending data' });
      }
    });

    // Health check endpoint
    app.get("/api/health", async (req, res) => {
      const mongoAlive = mongoose.connection.readyState === 1;
      res.status(200).json({
        status: "healthy",
        databases: {
          postgres: true,
          mongodb: mongoAlive
        }
      });
    });

    // Error handling
    app.use(errorHandler);
    app.use((req, res) => {
      res.status(404).json({ message: "Not Found" });
    });

    // Socket.IO Logic
    const activeSubscriptions = new Map();
    
    io.on("connection", (socket) => {
      console.log("Client connected:", socket.id);

      socket.on("subscribe", (period) => {
        const prevPeriod = activeSubscriptions.get(socket.id);
        if (prevPeriod) socket.leave(prevPeriod);
        
        socket.join(period);
        activeSubscriptions.set(socket.id, period);
        console.log(`Client ${socket.id} subscribed to ${period}`);
        
        fetchTrendingData(period)
          .then(data => socket.emit("trendingUpdate", data))
          .catch(err => console.error(`Data send error to ${socket.id}:`, err));
      });

      socket.on("disconnect", () => {
        activeSubscriptions.delete(socket.id);
        console.log("Client disconnected:", socket.id);
      });
    });

    // Start server
    server = httpServer.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`Socket.IO ready for connections`);
      console.log(`PostgreSQL: Connected ✅ | MongoDB: ${
        mongoose.connection.readyState === 1 ? 'Connected ✅' : 'Connecting...'
      }`);
    });

    // Handle server errors
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use`);
      } else {
        console.error('Server error:', err);
      }
      process.exit(1);
    });

  } catch (error) {
    console.error("Server startup failed:", error);
    await cleanup();
  }
};

// Trending data function
async function fetchTrendingData(period) {
  try {
    // Replace with actual MongoDB queries
    // Example:
    // return await mongoose.connection.db.collection('nfts')
    //   .find({...})
    //   .sort({volume: -1})
    //   .limit(5)
    //   .toArray();
    
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
      }
    ];
  } catch (err) {
    console.error('Failed to fetch trending data:', err);
    throw err;
  }
}

// Handle process termination
process.on('SIGTERM', cleanup);
process.on('SIGINT', cleanup);
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  cleanup();
});
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  cleanup();
});

// Start the application
startServer();