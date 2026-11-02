import { Router } from 'express';
import type { DbPool } from '../db.js';

interface StoreRow {
  id: number;
  code: string;
  name: string;
  address: string;
  manager_name: string;
  phone: string;
  currency: string;
  receipt_footer: string;
  opening_hours: string;
}

export function createStoresRouter(db: DbPool): Router {
  const router = Router();

  router.get('/', async (_req, res, next) => {
    try {
      const result = await db.query<StoreRow>(
        `SELECT id, code, name, address, manager_name, phone, currency, receipt_footer, opening_hours
         FROM stores
         ORDER BY id ASC`
      );

      const stores = result.rows.map((row) => ({
        id: row.id,
        code: row.code,
        name: row.name,
        address: row.address,
        managerName: row.manager_name,
        phone: row.phone,
        currency: row.currency,
        receiptFooter: row.receipt_footer,
        openingHours: row.opening_hours
      }));

      res.json({ stores });
    } catch (err) {
      next(err);
    }
  });

  return router;
}
