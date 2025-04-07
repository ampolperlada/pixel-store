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

// ES Module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from backend root (where package.json is)
dotenv.config({ path: path.resolve(__dirname, "../.env") });
console.log("DB URL:", process.env.DATABASE_URL); // Test logging

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

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

// Server setup
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  server.close(() => process.exit(1));
});