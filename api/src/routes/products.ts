import { Router } from 'express';
import type { DbPool } from '../db.js';

interface ProductRow {
  id: number;
  sku: string;
  name: string;
  category: string;
  unit_price_cents: number;
  vat_rate: string | number;
  stock_level: number;
  weekly_sales: number[];
}

export function createProductsRouter(db: DbPool): Router {
  const router = Router();

  router.get('/', async (_req, res, next) => {
    try {
      const result = await db.query<ProductRow>(
        `SELECT id, sku, name, category, unit_price_cents, vat_rate, stock_level, weekly_sales
         FROM products
         ORDER BY name ASC`
      );

      const products = result.rows.map((row) => ({
        id: row.id,
        sku: row.sku,
        name: row.name,
        category: row.category,
        unitPriceCents: row.unit_price_cents,
        vatRate: Number(row.vat_rate),
        stockLevel: row.stock_level,
        weeklySales: row.weekly_sales
      }));

      res.json({ products });
    } catch (err) {
      next(err);
    }
  });

  return router;
}
