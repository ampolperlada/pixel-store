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

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, "../.env") });
console.log("DB URL:", process.env.DATABASE_URL); // Verify env loading

// Initialize Express and HTTP server
const app = express();
const PORT = process.env.PORT || 5000;
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
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use("/api/", apiLimiter);

// Database Connection and Server Startup
const startServer = async () => {
  try {
    // Connect to databases first
    await connectPostgres();
    await connectMongoDB();

    // Routes
    app.use("/api/auth", authRoutes);
    app.use("/api/nfts", nftRoutes);
    app.use("/api/games", gameRoutes);

    // Trending collections endpoint
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

    // Health check
    app.get("/api/health", (req, res) => {
      res.status(200).json({ status: "healthy" });
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
          .catch(err => console.error(`Error sending data to ${socket.id}:`, err));
      });

      socket.on("disconnect", () => {
        activeSubscriptions.delete(socket.id);
        console.log("Client disconnected:", socket.id);
      });
    });

    // Start server
    httpServer.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`Socket.IO ready for connections`);
    });

  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
};

// Trending data function (replace with actual implementation)
async function fetchTrendingData(period) {
  // This should be replaced with your real database queries
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
    // ... other mock data
  ];
}

// Start the application
startServer();

// Handle unhandled rejections
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  process.exit(1);
});