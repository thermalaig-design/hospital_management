import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import process from 'process';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import path from 'path';
import { fileURLToPath } from 'url';
import memberRoutes from './routes/memberRoutes.js';
import authRoutes from './routes/authRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Handle favicon requests
app.get('/favicon.ico', (req, res) => res.status(204).end());

// Health check route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Trustee Portal API is running! 🚀',
    endpoints: {
      members: '/api/members',
      types: '/api/members/types',
      search: '/api/members/search?query=name&type=Trustee',
      byType: '/api/members/type/:type',
      byId: '/api/members/:id',
      doctors: '/api/doctors',
      committee: '/api/committee'
    }
  });
});

// API Routes
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'Hospital Management API',
    version: '1.0.0',
    endpoints: {
      members: '/api/members',
      types: '/api/members/types',
      search: '/api/members/search?query=name&type=Trustee',
      byType: '/api/members/type/:type',
      byId: '/api/members/:id',
      doctors: '/api/doctors',
      committee: '/api/committee'
    }
  });
});
app.use('/api', memberRoutes);
app.use('/api/auth', authRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log('🚀 Server is running on port', PORT);
  console.log(`📍 API URL: http://localhost:${PORT}`);
  console.log(`📍 Health Check: http://localhost:${PORT}/`);
});