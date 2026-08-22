import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import adminDashboardRoutes from './routes/adminDashboardRoutes.js';
import { generalLimiter } from './middlewares/rateLimiter.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/shopii';

// Enable trust proxy when behind Nginx Load Balancer
app.set('trust proxy', 1);

// Connect to existing MongoDB database
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log(`[MongoDB] Connected successfully to existing database: ${mongoose.connection.name}`);
  })
  .catch((err) => {
    console.error('[MongoDB] Connection error:', err.message);
  });

app.use(cors());
app.use(express.json());

// Apply IP-based Rate Limiter to protect all APIs from DDoS / abusive requests
app.use('/api/', generalLimiter);

// Base health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'eBay Clone Marketplace Backend',
    instancePort: PORT,
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  });
});

// Admin Dashboard Routes
app.use('/api/admin/dashboard', adminDashboardRoutes);

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`eBay Clone Backend Server running on port ${PORT}`);
  });
}

export default app;
