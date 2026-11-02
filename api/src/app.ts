import cors from 'cors';
import express, { type Express, type NextFunction, type Request, type Response } from 'express';
import { pool, type DbPool } from './db.js';
import { createProductsRouter } from './routes/products.js';
import { createSalesRouter } from './routes/sales.js';
import { createStoresRouter } from './routes/stores.js';

export function createApp(db: DbPool = pool): Express {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/api/products', createProductsRouter(db));
  app.use('/api/stores', createStoresRouter(db));
  app.use('/api/sales', createSalesRouter(db));

  app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    const message = err instanceof Error ? err.message : 'Internal server error';
    res.status(500).json({ error: message });
  });

  return app;
}
