import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import { connectPostgres, connectMongoDB, shutdown } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import nftRoutes from './routes/nftRoutes.js';
import gameRoutes from './routes/gameRoutes.js';
import emailRoute from './routes/emailRoute.js';
import errorHandler from './middleware/errorMiddleware.js';
import cookieParser from 'cookie-parser';
import { createServer } from 'http';
import { Server } from 'socket.io';

// Config setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// App initialization
const app = express();
const PORT = process.env.PORT || 5001;
const httpServer = createServer(app);

// Socket.IO setup
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later'
});
app.use('/api/', limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/nfts', nftRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/email', emailRoute); // Changed to more specific path

// Health check endpoint
app.get('/api/health', async (req, res) => {
  const mongoAlive = mongoose.connection.readyState === 1;
  res.status(200).json({
    status: 'healthy',
    databases: {
      postgres: true,
      mongodb: mongoAlive,
    },
    services: {
      email: true
    }
  });
});

// Error handling
app.use(errorHandler);
app.use((req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

// Socket.IO Logic
const activeSubscriptions = new Map();

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('subscribe', (period) => {
    const prevPeriod = activeSubscriptions.get(socket.id);
    if (prevPeriod) socket.leave(prevPeriod);

    socket.join(period);
    activeSubscriptions.set(socket.id, period);
    console.log(`Client ${socket.id} subscribed to ${period}`);

    fetchTrendingData(period)
      .then((data) => socket.emit('trendingUpdate', data))
      .catch((err) => console.error(`Data send error to ${socket.id}:`, err));
  });

  socket.on('disconnect', () => {
    activeSubscriptions.delete(socket.id);
    console.log('Client disconnected:', socket.id);
  });
});

// Server management
const startServer = async () => {
  try {
    console.log('⏳ Connecting to databases...');
    await connectPostgres();
    await connectMongoDB();

    httpServer.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`PostgreSQL: Connected ✅ | MongoDB: ${
        mongoose.connection.readyState === 1 ? 'Connected ✅' : 'Connecting...'
      }`);
    });
  } catch (error) {
    console.error('Server startup failed:', error);
    process.exit(1);
  }
};

// Cleanup function
const cleanup = async () => {
  console.log('\n🛑 Shutting down gracefully...');
  try {
    await shutdown();
    process.exit(0);
  } catch (err) {
    console.error('Cleanup error:', err);
    process.exit(1);
  }
};

// Process handlers
process.on('SIGTERM', cleanup);
process.on('SIGINT', cleanup);
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  cleanup();
});
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  cleanup();
});

// Start the server
startServer();