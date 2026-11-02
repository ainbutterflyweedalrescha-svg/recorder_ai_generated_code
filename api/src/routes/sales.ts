import { Router } from 'express';
import type { DbPool } from '../db.js';
import { createSaleSchema, saleIdParamSchema } from '../schemas.js';

interface SaleSummaryRow {
  id: number;
  store_id: number;
  store_name: string;
  cashier_name: string;
  payment_method: 'card' | 'cash' | 'contactless';
  subtotal_cents: number;
  vat_cents: number;
  total_cents: number;
  item_count: string | number;
  created_at: string;
}

interface SaleHeaderRow {
  id: number;
  store_id: number;
  store_name: string;
  cashier_name: string;
  payment_method: 'card' | 'cash' | 'contactless';
  subtotal_cents: number;
  vat_cents: number;
  total_cents: number;
  created_at: string;
}

interface SaleItemRow {
  id: number;
  product_id: number;
  product_name: string;
  sku: string;
  quantity: number;
  unit_price_cents: number;
  vat_rate: string | number;
  line_total_cents: number;
}

interface ProductLookupRow {
  id: number;
  sku: string;
  name: string;
  unit_price_cents: number;
  vat_rate: string | number;
  stock_level: number;
}

export function createSalesRouter(db: DbPool): Router {
  const router = Router();

  router.get('/', async (_req, res, next) => {
    try {
      const result = await db.query<SaleSummaryRow>(
        `SELECT
           s.id,
           s.store_id,
           st.name AS store_name,
           s.cashier_name,
           s.payment_method,
           s.subtotal_cents,
           s.vat_cents,
           s.total_cents,
           COALESCE(SUM(si.quantity), 0) AS item_count,
           s.created_at
         FROM sales s
         JOIN stores st ON st.id = s.store_id
         LEFT JOIN sale_items si ON si.sale_id = s.id
         GROUP BY s.id, st.name
         ORDER BY s.created_at DESC, s.id DESC
         LIMIT 150`
      );

      const sales = result.rows.map((row) => ({
        id: row.id,
        storeId: row.store_id,
        storeName: row.store_name,
        cashierName: row.cashier_name,
        paymentMethod: row.payment_method,
        subtotalCents: row.subtotal_cents,
        vatCents: row.vat_cents,
        totalCents: row.total_cents,
        itemCount: Number(row.item_count),
        createdAt: row.created_at
      }));

      res.json({ sales });
    } catch (err) {
      next(err);
    }
  });

  router.get('/:id', async (req, res, next) => {
    try {
      const parsedParams = saleIdParamSchema.safeParse(req.params);
      if (!parsedParams.success) {
        res.status(400).json({ error: 'Invalid sale ID', details: parsedParams.error.flatten() });
        return;
      }

      const saleId = parsedParams.data.id;
      const saleResult = await db.query<SaleHeaderRow>(
        `SELECT
           s.id,
           s.store_id,
           st.name AS store_name,
           s.cashier_name,
           s.payment_method,
           s.subtotal_cents,
           s.vat_cents,
           s.total_cents,
           s.created_at
         FROM sales s
         JOIN stores st ON st.id = s.store_id
         WHERE s.id = $1`,
        [saleId]
      );

      if (saleResult.rows.length === 0) {
        res.status(404).json({ error: 'Sale not found' });
        return;
      }

      const itemsResult = await db.query<SaleItemRow>(
        `SELECT id, product_id, product_name, sku, quantity, unit_price_cents, vat_rate, line_total_cents
         FROM sale_items
         WHERE sale_id = $1
         ORDER BY id ASC`,
        [saleId]
      );

      const header = saleResult.rows[0];
      res.json({
        sale: {
          id: header.id,
          storeId: header.store_id,
          storeName: header.store_name,
          cashierName: header.cashier_name,
          paymentMethod: header.payment_method,
          subtotalCents: header.subtotal_cents,
          vatCents: header.vat_cents,
          totalCents: header.total_cents,
          createdAt: header.created_at,
          items: itemsResult.rows.map((item) => ({
            id: item.id,
            productId: item.product_id,
            productName: item.product_name,
            sku: item.sku,
            quantity: item.quantity,
            unitPriceCents: item.unit_price_cents,
            vatRate: Number(item.vat_rate),
            lineTotalCents: item.line_total_cents
          }))
        }
      });
    } catch (err) {
      next(err);
    }
  });

  router.post('/', async (req, res, next) => {
    const parsedBody = createSaleSchema.safeParse(req.body);
    if (!parsedBody.success) {
      res.status(400).json({ error: 'Invalid sale payload', details: parsedBody.error.flatten() });
      return;
    }

    const { storeId, cashierName, paymentMethod, items } = parsedBody.data;
    const client = await db.connect();

    try {
      await client.query('BEGIN');

      const productIds = items.map((item) => item.productId);
      const productsResult = await client.query<ProductLookupRow>(
        `SELECT id, sku, name, unit_price_cents, vat_rate, stock_level
         FROM products
         WHERE id = ANY($1::int[])
         FOR UPDATE`,
        [productIds]
      );

      const productById = new Map<number, ProductLookupRow>();
      for (const row of productsResult.rows) {
        productById.set(row.id, row);
      }

      let subtotalCents = 0;
      let vatCents = 0;
      const computedItems: Array<{
        productId: number;
        sku: string;
        productName: string;
        quantity: number;
        unitPriceCents: number;
        vatRate: number;
        lineTotalCents: number;
      }> = [];

      for (const requested of items) {
        const product = productById.get(requested.productId);
        if (!product) {
          await client.query('ROLLBACK');
          res.status(400).json({ error: `Unknown product ID ${requested.productId}` });
          return;
        }
        if (product.stock_level < requested.quantity) {
          await client.query('ROLLBACK');
          res.status(409).json({ error: `Insufficient stock for ${product.name}` });
          return;
        }

        const vatRate = Number(product.vat_rate);
        const lineSubtotal = product.unit_price_cents * requested.quantity;
        const lineVat = Math.round(lineSubtotal * vatRate);
        const lineTotalCents = lineSubtotal + lineVat;

        subtotalCents += lineSubtotal;
        vatCents += lineVat;

        computedItems.push({
          productId: product.id,
          sku: product.sku,
          productName: product.name,
          quantity: requested.quantity,
          unitPriceCents: product.unit_price_cents,
          vatRate,
          lineTotalCents
        });
      }

      const totalCents = subtotalCents + vatCents;

      const saleInsert = await client.query<{ id: number; created_at: string }>(
        `INSERT INTO sales (store_id, cashier_name, payment_method, subtotal_cents, vat_cents, total_cents)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id, created_at`,
        [storeId, cashierName, paymentMethod, subtotalCents, vatCents, totalCents]
      );

      const saleId = saleInsert.rows[0].id;
      const createdAt = saleInsert.rows[0].created_at;

      for (const line of computedItems) {
        await client.query(
          `INSERT INTO sale_items (sale_id, product_id, product_name, sku, quantity, unit_price_cents, vat_rate, line_total_cents)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [
            saleId,
            line.productId,
            line.productName,
            line.sku,
            line.quantity,
            line.unitPriceCents,
            line.vatRate,
            line.lineTotalCents
          ]
        );

        await client.query(
          `UPDATE products
           SET stock_level = stock_level - $1
           WHERE id = $2`,
          [line.quantity, line.productId]
        );
      }

      await client.query('COMMIT');

      res.status(201).json({
        sale: {
          id: saleId,
          storeId,
          cashierName,
          paymentMethod,
          subtotalCents,
          vatCents,
          totalCents,
          createdAt,
          items: computedItems
        }
      });
    } catch (err) {
      await client.query('ROLLBACK');
      next(err);
    } finally {
      client.release();
    }
  });

  return router;
}
