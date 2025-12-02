import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import { connectDatabase, disconnectDatabase } from './config/database.js';
import authRoutes from './routes/auth.routes.js';
import reviewsRoutes from './routes/reviews.routes.js';
import responsesRoutes from './routes/responses.routes.js';
import aiRoutes from './routes/ai.routes.js';

const app = express();

// Middleware
app.use(cors({
  origin: env.APP_URL,
  credentials: true,
}));
app.use(express.json());

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/responses', responsesRoutes);
app.use('/api/ai', aiRoutes);

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
