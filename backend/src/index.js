import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { connectPostgres, connectMongoDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import nftRoutes from "./routes/nftRoutes.js";
import gameRoutes from "./routes/gameRoutes.js";
import { apiLimiter } from "./middleware/rateLimit.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Security & Middleware
app.use("/api/", apiLimiter);
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan("dev"));

// Connect to Databases
(async () => {
  await connectPostgres();
  await connectMongoDB();
})();


// Routes
app.use("/api/auth", authRoutes);
app.use("/api/nfts", nftRoutes);
app.use("/api/games", gameRoutes);

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));