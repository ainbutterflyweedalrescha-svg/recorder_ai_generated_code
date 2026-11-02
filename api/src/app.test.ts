import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from './app.js';
import type { DbClient, DbPool, QueryResultRow } from './db.js';

function createFakeDbPool(): DbPool {
  const sampleProducts = [
    {
      id: 1,
      sku: 'BAK-101',
      name: 'Country Sourdough Loaf',
      category: 'Bakery',
      unit_price_cents: 650,
      vat_rate: '0.0500',
      stock_level: 28,
      weekly_sales: [42, 45, 48, 44, 51, 53, 49, 56, 58, 54, 60, 62]
    },
    {
      id: 2,
      sku: 'BEV-401',
      name: 'Cold Brew Coffee Can 250ml',
      category: 'Beverages',
      unit_price_cents: 330,
      vat_rate: '0.2000',
      stock_level: 72,
      weekly_sales: [95, 98, 102, 106, 110, 108, 114, 118, 120, 123, 126, 130]
    }
  ];

  const executeQuery = async <T extends QueryResultRow = QueryResultRow>(
    text: string
  ): Promise<{ rows: T[]; rowCount: number | null }> => {
    if (text.includes('FROM products') && text.includes('ORDER BY name ASC')) {
      return { rows: sampleProducts as unknown as T[], rowCount: sampleProducts.length };
    }
    if (text.includes('FROM products') && text.includes('FOR UPDATE')) {
      return { rows: [sampleProducts[0]] as unknown as T[], rowCount: 1 };
    }
    if (text.includes('INSERT INTO sales')) {
      return {
        rows: [{ id: 151, created_at: '2026-11-01T12:00:00.000Z' }] as unknown as T[],
        rowCount: 1
      };
    }
    return { rows: [], rowCount: 0 };
  };

  const client: DbClient = {
    query: executeQuery,
    release: () => undefined
  };

  return {
    query: executeQuery,
    connect: async () => client
  };
}

describe('RegisterFlow API', () => {
  it('GET /api/products returns the catalog with numeric VAT rates and weekly sales history', async () => {
    const app = createApp(createFakeDbPool());
    const response = await request(app).get('/api/products');

    expect(response.status).toBe(200);
    expect(response.body.products).toHaveLength(2);
    expect(response.body.products[0]).toMatchObject({
      id: 1,
      sku: 'BAK-101',
      name: 'Country Sourdough Loaf',
      unitPriceCents: 650,
      vatRate: 0.05,
      stockLevel: 28
    });
    expect(response.body.products[0].weeklySales).toHaveLength(12);
  });

  it('POST /api/sales validates input with Zod and records a sale with computed VAT', async () => {
    const app = createApp(createFakeDbPool());

    const invalidResponse = await request(app).post('/api/sales').send({
      storeId: 1,
      cashierName: '',
      paymentMethod: 'card',
      items: []
    });
    expect(invalidResponse.status).toBe(400);

    const validResponse = await request(app)
      .post('/api/sales')
      .send({
        storeId: 1,
        cashierName: 'Dana Reyes',
        paymentMethod: 'card',
        items: [{ productId: 1, quantity: 2 }]
      });

    expect(validResponse.status).toBe(201);
    expect(validResponse.body.sale).toMatchObject({
      id: 151,
      storeId: 1,
      cashierName: 'Dana Reyes',
      subtotalCents: 1300,
      vatCents: 65,
      totalCents: 1365
    });
  });
});
