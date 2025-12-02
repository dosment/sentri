import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import { connectDatabase, disconnectDatabase, prisma } from './config/database.js';
import { generalLimiter, authLimiter, aiLimiter } from './middleware/rate-limit.middleware.js';
import authRoutes from './routes/auth.routes.js';
import reviewsRoutes from './routes/reviews.routes.js';
import responsesRoutes from './routes/responses.routes.js';
import aiRoutes from './routes/ai.routes.js';

const app = express();

// Security middleware
// CORS: Only allow requests from our frontend origin
// This is the primary CSRF defense when using Authorization header (not cookies)
app.use(cors({
  origin: env.APP_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Limit request body size to prevent DoS
app.use(express.json({ limit: '10kb' }));

// Health check - verifies database connectivity
app.get('/health', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(503).json({ status: 'unhealthy', error: 'Database connection failed' });
  }
});

// API routes with rate limiting
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/reviews', generalLimiter, reviewsRoutes);
app.use('/api/responses', generalLimiter, responsesRoutes);
app.use('/api/ai', aiLimiter, aiRoutes);

// Error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// Startup
async function start() {
  await connectDatabase();

  app.listen(env.PORT, () => {
    console.log(`Server running on port ${env.PORT}`);
    console.log(`Environment: ${env.NODE_ENV}`);
  });
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down...');
  await disconnectDatabase();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down...');
  await disconnectDatabase();
  process.exit(0);
});

start().catch(console.error);
