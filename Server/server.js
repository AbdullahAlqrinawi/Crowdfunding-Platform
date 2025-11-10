import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './Routes/userRoutes.js';
import projectRoutes from './Routes/projectRoutes.js';
import donationRoutes from './Routes/donationRoutes.js';
import commentRoutes from './Routes/commentRoutes.js';
import likeRoutes from './Routes/likeRoutes.js';
import supportTierRoutes from './Routes/supportTierRoutes.js';
import aiRoutes from "./Routes/ai.js";


// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'], 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], 
  allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));


// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log(' Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/support-tiers', supportTierRoutes);
app.use("/api/ai", aiRoutes);


// Default Route
app.get('/', (req, res) => {
  res.status(200).json({ error: false, message: 'Welcome to the Crowdfunding Platform API' });
});

// Error Handling Middleware
app.use((req, res) => {
  res.status(404).json({ error: true, message: 'Route not found' });
});

// Server Setup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});
  