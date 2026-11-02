import pg from 'pg';

export interface SeedStore {
  code: string;
  name: string;
  address: string;
  managerName: string;
  phone: string;
  currency: string;
  receiptFooter: string;
  openingHours: string;
}

export interface SeedProduct {
  sku: string;
  name: string;
  category: string;
  unitPriceCents: number;
  vatRate: number;
  stockLevel: number;
  weeklySales: number[];
}

export const SEED_STORES: SeedStore[] = [
  {
    code: 'HSM-01',
    name: 'Harbor Street Market',
    address: '142 Harbor Street, North Quay',
    managerName: 'Dana Reyes',
    phone: '(555) 014-2201',
    currency: 'USD',
    receiptFooter: 'Thank you for shopping at Harbor Street Market.',
    openingHours: 'Mon-Sun 07:00 - 22:00'
  },
  {
    code: 'ECG-02',
    name: 'Elmwood Corner Grocer',
    address: '88 Elmwood Avenue, Westpark',
    managerName: 'Marcus Vance',
    phone: '(555) 014-2202',
    currency: 'USD',
    receiptFooter: 'Fresh neighborhood goods daily at Elmwood Corner Grocer.',
    openingHours: 'Mon-Sun 06:30 - 21:30'
  },
  {
    code: 'BHP-03',
    name: 'Beacon Hill Provisions',
    address: '319 Beacon Hill Road, Old Town',
    managerName: 'Tessa Lindqvist',
    phone: '(555) 014-2203',
    currency: 'USD',
    receiptFooter: 'See you soon at Beacon Hill Provisions.',
    openingHours: 'Mon-Sun 07:30 - 22:00'
  }
];

export const SEED_PRODUCTS: SeedProduct[] = [
  { sku: 'BAK-101', name: 'Country Sourdough Loaf', category: 'Bakery', unitPriceCents: 650, vatRate: 0.05, stockLevel: 28, weeklySales: [42, 45, 48, 44, 51, 53, 49, 56, 58, 54, 60, 62] },
  { sku: 'BAK-102', name: 'Sesame Seed Bagel', category: 'Bakery', unitPriceCents: 220, vatRate: 0.05, stockLevel: 64, weeklySales: [85, 88, 82, 90, 94, 91, 96, 102, 98, 105, 108, 110] },
  { sku: 'BAK-103', name: 'Butter Croissant', category: 'Bakery', unitPriceCents: 340, vatRate: 0.05, stockLevel: 40, weeklySales: [70, 74, 68, 79, 83, 80, 85, 89, 86, 92, 95, 97] },
  { sku: 'BAK-104', name: 'Cinnamon Morning Bun', category: 'Bakery', unitPriceCents: 380, vatRate: 0.05, stockLevel: 32, weeklySales: [48, 52, 50, 55, 53, 58, 60, 62, 59, 64, 66, 68] },
  { sku: 'BAK-105', name: 'Multigrain Sandwich Bread', category: 'Bakery', unitPriceCents: 580, vatRate: 0.05, stockLevel: 24, weeklySales: [34, 36, 35, 39, 41, 38, 42, 44, 43, 45, 47, 46] },
  { sku: 'BAK-106', name: 'Blueberry Oat Muffin', category: 'Bakery', unitPriceCents: 360, vatRate: 0.05, stockLevel: 35, weeklySales: [54, 50, 56, 58, 61, 59, 63, 67, 65, 68, 70, 72] },
  { sku: 'DAI-201', name: 'Whole Pasture Milk 1L', category: 'Dairy & Eggs', unitPriceCents: 390, vatRate: 0.05, stockLevel: 52, weeklySales: [110, 115, 108, 118, 122, 120, 125, 119, 128, 130, 127, 134] },
  { sku: 'DAI-202', name: 'Barista Oat Drink 1L', category: 'Dairy & Eggs', unitPriceCents: 450, vatRate: 0.05, stockLevel: 48, weeklySales: [92, 96, 98, 104, 101, 108, 112, 115, 118, 121, 124, 129] },
  { sku: 'DAI-203', name: 'Free-Range Large Eggs 12pk', category: 'Dairy & Eggs', unitPriceCents: 620, vatRate: 0.05, stockLevel: 38, weeklySales: [78, 80, 84, 82, 86, 89, 88, 91, 94, 93, 96, 99] },
  { sku: 'DAI-204', name: 'Cultured Salted Butter 250g', category: 'Dairy & Eggs', unitPriceCents: 540, vatRate: 0.05, stockLevel: 30, weeklySales: [44, 46, 45, 49, 51, 50, 52, 54, 53, 56, 55, 58] },
  { sku: 'DAI-205', name: 'Aged White Cheddar 200g', category: 'Dairy & Eggs', unitPriceCents: 680, vatRate: 0.05, stockLevel: 26, weeklySales: [38, 40, 39, 43, 45, 42, 46, 48, 47, 50, 51, 53] },
  { sku: 'DAI-206', name: 'Greek Strained Yogurt 500g', category: 'Dairy & Eggs', unitPriceCents: 510, vatRate: 0.05, stockLevel: 34, weeklySales: [62, 65, 64, 68, 70, 72, 69, 74, 76, 75, 78, 81] },
  { sku: 'PRO-301', name: 'Honeycrisp Apples 1kg', category: 'Produce', unitPriceCents: 490, vatRate: 0.00, stockLevel: 45, weeklySales: [66, 68, 71, 69, 73, 75, 74, 78, 80, 79, 82, 84] },
  { sku: 'PRO-302', name: 'Fairtrade Bananas Bunch', category: 'Produce', unitPriceCents: 260, vatRate: 0.00, stockLevel: 60, weeklySales: [120, 124, 119, 126, 130, 128, 132, 135, 131, 138, 140, 142] },
  { sku: 'PRO-303', name: 'Hass Avocados 2pk', category: 'Produce', unitPriceCents: 420, vatRate: 0.00, stockLevel: 36, weeklySales: [74, 78, 76, 80, 85, 83, 88, 86, 90, 92, 91, 95] },
  { sku: 'PRO-304', name: 'Cherry Vine Tomatoes 250g', category: 'Produce', unitPriceCents: 350, vatRate: 0.00, stockLevel: 42, weeklySales: [58, 60, 57, 62, 64, 63, 66, 68, 67, 70, 72, 71] },
  { sku: 'PRO-305', name: 'Baby Spinach Leaves 200g', category: 'Produce', unitPriceCents: 320, vatRate: 0.00, stockLevel: 29, weeklySales: [52, 55, 53, 57, 59, 61, 60, 63, 65, 64, 67, 69] },
  { sku: 'PRO-306', name: 'Unwaxed Amalfi Lemons 3pk', category: 'Produce', unitPriceCents: 290, vatRate: 0.00, stockLevel: 50, weeklySales: [41, 43, 40, 44, 46, 45, 48, 47, 50, 52, 51, 54] },
  { sku: 'BEV-401', name: 'Cold Brew Coffee Can 250ml', category: 'Beverages', unitPriceCents: 330, vatRate: 0.20, stockLevel: 72, weeklySales: [95, 98, 102, 106, 110, 108, 114, 118, 120, 123, 126, 130] },
  { sku: 'BEV-402', name: 'Sparkling Mineral Water 750ml', category: 'Beverages', unitPriceCents: 240, vatRate: 0.20, stockLevel: 84, weeklySales: [88, 90, 86, 92, 95, 94, 98, 100, 99, 103, 105, 107] },
  { sku: 'BEV-403', name: 'Blood Orange Soda 330ml', category: 'Beverages', unitPriceCents: 280, vatRate: 0.20, stockLevel: 65, weeklySales: [60, 63, 65, 62, 68, 70, 72, 75, 73, 77, 79, 82] },
  { sku: 'BEV-404', name: 'Ginger Turmeric Kombucha 350ml', category: 'Beverages', unitPriceCents: 410, vatRate: 0.20, stockLevel: 44, weeklySales: [49, 51, 54, 56, 55, 58, 61, 63, 62, 65, 67, 69] },
  { sku: 'BEV-405', name: 'Pressed Cloudy Apple Juice 1L', category: 'Beverages', unitPriceCents: 460, vatRate: 0.20, stockLevel: 38, weeklySales: [45, 48, 47, 50, 52, 51, 54, 56, 55, 58, 60, 59] },
  { sku: 'BEV-406', name: 'Earl Grey Loose Leaf Tea 125g', category: 'Beverages', unitPriceCents: 740, vatRate: 0.05, stockLevel: 22, weeklySales: [24, 26, 25, 28, 27, 29, 31, 30, 32, 33, 34, 35] },
  { sku: 'BEV-407', name: 'House Espresso Beans 250g', category: 'Beverages', unitPriceCents: 1150, vatRate: 0.05, stockLevel: 31, weeklySales: [36, 38, 39, 41, 40, 43, 45, 44, 47, 48, 50, 52] },
  { sku: 'PAN-501', name: 'Bronze-Die Spaghetti 500g', category: 'Pantry', unitPriceCents: 310, vatRate: 0.05, stockLevel: 58, weeklySales: [64, 62, 67, 69, 71, 68, 73, 75, 74, 77, 79, 80] },
  { sku: 'PAN-502', name: 'San Marzano Peeled Tomatoes 400g', category: 'Pantry', unitPriceCents: 290, vatRate: 0.05, stockLevel: 66, weeklySales: [72, 75, 73, 78, 80, 79, 82, 85, 84, 87, 89, 91] },
  { sku: 'PAN-503', name: 'Extra Virgin Olive Oil 500ml', category: 'Pantry', unitPriceCents: 1290, vatRate: 0.05, stockLevel: 25, weeklySales: [28, 30, 29, 31, 33, 32, 34, 36, 35, 37, 38, 40] },
  { sku: 'PAN-504', name: 'Flaky Sea Salt 240g', category: 'Pantry', unitPriceCents: 480, vatRate: 0.05, stockLevel: 33, weeklySales: [22, 24, 23, 25, 26, 25, 27, 28, 29, 28, 30, 31] },
  { sku: 'PAN-505', name: 'Organic Chickpeas 400g', category: 'Pantry', unitPriceCents: 190, vatRate: 0.05, stockLevel: 76, weeklySales: [55, 58, 56, 60, 62, 61, 64, 66, 65, 68, 70, 72] },
  { sku: 'PAN-506', name: 'Crunchy Roasted Peanut Butter 340g', category: 'Pantry', unitPriceCents: 520, vatRate: 0.05, stockLevel: 41, weeklySales: [46, 48, 49, 51, 50, 53, 55, 54, 57, 59, 58, 61] },
  { sku: 'PAN-507', name: 'Wildflower Raw Honey 350g', category: 'Pantry', unitPriceCents: 890, vatRate: 0.05, stockLevel: 19, weeklySales: [20, 21, 22, 20, 23, 24, 25, 24, 26, 27, 28, 29] },
  { sku: 'PAN-508', name: 'Basmati White Rice 1kg', category: 'Pantry', unitPriceCents: 440, vatRate: 0.05, stockLevel: 47, weeklySales: [39, 41, 40, 42, 44, 43, 46, 47, 48, 50, 49, 51] },
  { sku: 'SNK-601', name: 'Sea Salt Kettle Crisps 150g', category: 'Snacks', unitPriceCents: 320, vatRate: 0.20, stockLevel: 68, weeklySales: [82, 85, 84, 88, 91, 89, 93, 96, 95, 98, 101, 104] },
  { sku: 'SNK-602', name: '70% Dark Chocolate Bar 100g', category: 'Snacks', unitPriceCents: 430, vatRate: 0.20, stockLevel: 54, weeklySales: [68, 70, 72, 69, 74, 76, 78, 80, 79, 82, 84, 86] },
  { sku: 'SNK-603', name: 'Roasted Smoked Almonds 180g', category: 'Snacks', unitPriceCents: 560, vatRate: 0.20, stockLevel: 39, weeklySales: [40, 42, 41, 44, 46, 45, 47, 49, 48, 51, 52, 54] },
  { sku: 'SNK-604', name: 'Maple Pecan Oat Granola Bar', category: 'Snacks', unitPriceCents: 250, vatRate: 0.20, stockLevel: 75, weeklySales: [76, 79, 77, 81, 84, 82, 86, 88, 87, 90, 92, 94] },
  { sku: 'HOU-701', name: 'Recycled Kitchen Paper Towels 2pk', category: 'Household', unitPriceCents: 380, vatRate: 0.20, stockLevel: 46, weeklySales: [32, 34, 33, 35, 36, 35, 38, 39, 37, 40, 41, 42] },
  { sku: 'HOU-702', name: 'Lavender Dishwashing Liquid 500ml', category: 'Household', unitPriceCents: 410, vatRate: 0.20, stockLevel: 37, weeklySales: [26, 27, 28, 27, 29, 30, 31, 30, 32, 33, 34, 35] },
  { sku: 'HOU-703', name: 'Cedarwood Hand Soap Refill 500ml', category: 'Household', unitPriceCents: 640, vatRate: 0.20, stockLevel: 27, weeklySales: [18, 19, 20, 19, 21, 22, 21, 23, 24, 23, 25, 26] }
];

export const CASHIERS = [
  'Dana Reyes',
  'Marcus Vance',
  'Tessa Lindqvist',
  'Omar Haddad',
  'Clara Novak',
  'Nadia Cho'
] as const;

export const PAYMENT_METHODS = ['card', 'cash', 'contactless'] as const;


const { Pool } = pg;

async function seedDatabase(): Promise<void> {
  const connectionString =
    process.env.DATABASE_URL ?? 'postgres://localhost:5432/registerflow';
  const pool = new Pool({ connectionString });
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    await client.query('TRUNCATE TABLE sale_items, sales, products, stores RESTART IDENTITY CASCADE');

    const storeIds: number[] = [];
    for (const store of SEED_STORES) {
      const result = await client.query<{ id: number }>(
        `INSERT INTO stores (code, name, address, manager_name, phone, currency, receipt_footer, opening_hours)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING id`,
        [
          store.code,
          store.name,
          store.address,
          store.managerName,
          store.phone,
          store.currency,
          store.receiptFooter,
          store.openingHours
        ]
      );
      storeIds.push(result.rows[0].id);
    }

    const insertedProducts: Array<{
      id: number;
      sku: string;
      name: string;
      unitPriceCents: number;
      vatRate: number;
    }> = [];

    for (const product of SEED_PRODUCTS) {
      const result = await client.query<{ id: number }>(
        `INSERT INTO products (sku, name, category, unit_price_cents, vat_rate, stock_level, weekly_sales)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING id`,
        [
          product.sku,
          product.name,
          product.category,
          product.unitPriceCents,
          product.vatRate,
          product.stockLevel,
          product.weeklySales
        ]
      );
      insertedProducts.push({
        id: result.rows[0].id,
        sku: product.sku,
        name: product.name,
        unitPriceCents: product.unitPriceCents,
        vatRate: product.vatRate
      });
    }

    const baseTimestamp = Date.UTC(2026, 9, 1, 8, 0, 0);

    for (let i = 0; i < 150; i += 1) {
      const storeId = storeIds[i % storeIds.length];
      const cashierName = CASHIERS[i % CASHIERS.length];
      const paymentMethod = PAYMENT_METHODS[i % PAYMENT_METHODS.length];
      const createdAt = new Date(baseTimestamp + i * 4 * 60 * 60 * 1000).toISOString();

      const itemCount = (i % 3) + 1;
      const lineItems: Array<{
        productId: number;
        productName: string;
        sku: string;
        quantity: number;
        unitPriceCents: number;
        vatRate: number;
        lineSubtotalCents: number;
        lineVatCents: number;
        lineTotalCents: number;
      }> = [];

      let subtotalCents = 0;
      let vatCents = 0;

      for (let j = 0; j < itemCount; j += 1) {
        const product = insertedProducts[(i * 3 + j * 7) % insertedProducts.length];
        const quantity = ((i + j) % 3) + 1;
        const lineSubtotalCents = product.unitPriceCents * quantity;
        const lineVatCents = Math.round(lineSubtotalCents * product.vatRate);
        const lineTotalCents = lineSubtotalCents + lineVatCents;

        subtotalCents += lineSubtotalCents;
        vatCents += lineVatCents;

        lineItems.push({
          productId: product.id,
          productName: product.name,
          sku: product.sku,
          quantity,
          unitPriceCents: product.unitPriceCents,
          vatRate: product.vatRate,
          lineSubtotalCents,
          lineVatCents,
          lineTotalCents
        });
      }

      const totalCents = subtotalCents + vatCents;

      const saleResult = await client.query<{ id: number }>(
        `INSERT INTO sales (store_id, cashier_name, payment_method, subtotal_cents, vat_cents, total_cents, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING id`,
        [storeId, cashierName, paymentMethod, subtotalCents, vatCents, totalCents, createdAt]
      );

      const saleId = saleResult.rows[0].id;

      for (const item of lineItems) {
        await client.query(
          `INSERT INTO sale_items (sale_id, product_id, product_name, sku, quantity, unit_price_cents, vat_rate, line_total_cents)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [
            saleId,
            item.productId,
            item.productName,
            item.sku,
            item.quantity,
            item.unitPriceCents,
            item.vatRate,
            item.lineTotalCents
          ]
        );
      }
    }

    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

seedDatabase().catch((err: unknown) => {
  process.stderr.write(`Seed failed: ${String(err)}
`);
  process.exit(1);
});
