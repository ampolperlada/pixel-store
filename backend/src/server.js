import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import { connectPostgres, connectMongoDB } from "./config/db.js";
import authRoutes from "./routes/auth.js";
import nftRoutes from "./routes/nftRoutes.js"; // <== Import NFT Routes
import errorHandler from "./middleware/errorMiddleware.js";

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Security Middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(morgan("dev"));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

// Body parser
app.use(express.json({ limit: "10kb" }));

// Connect to databases
(async () => {
  await connectPostgres();
  await connectMongoDB();
})();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/nfts", nftRoutes); // <== Register NFT Routes

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
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  server.close(() => process.exit(1));
});
