require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');
const { requestLogger } = require('./middleware/requestLogger');
const { logger } = require('./utils/logger');

const DEFAULT_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:3000',
  'https://apiszen.com',
  'https://www.apiszen.com',
  'https://annakshetram.onrender.com',
];
const extraOrigins = (process.env.CLIENT_URL || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);
const allowedOrigins = [...new Set([...DEFAULT_ORIGINS, ...extraOrigins])];

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const cartRoutes = require('./routes/cartRoutes');
const adminRoutes = require('./routes/adminRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();
app.set('trust proxy', 1);

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: false,
  })
);

// Connect to MongoDB
connectDB();

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (!origin || allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
  }
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,PATCH,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);


// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/orders', orderRoutes);

// Health check (no internal details)
app.get('/api/health', (req, res) => {
  res.json({ success: true });
});

// Seed endpoint — protected by secret key
app.post('/api/seed', async (req, res) => {
  const { secret } = req.body;
  if (secret !== process.env.SEED_SECRET) {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }
  try {
    const runSeed = require('./utils/seed');
    await runSeed();
    res.json({ success: true, message: 'Seed completed' });
  } catch (err) {
    logger.error('Seed failed', {
      category: 'seed',
      success: false,
      meta: { message: err.message },
      stack: err.stack,
    });
    res.status(500).json({ success: false, message: 'Seed failed' });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handler (no stack or raw DB errors in response)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Server listening on port ${PORT}`, { category: 'startup', success: true, meta: { port: PORT } });
});
