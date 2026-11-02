CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  sku VARCHAR(32) NOT NULL UNIQUE,
  name VARCHAR(140) NOT NULL,
  category VARCHAR(64) NOT NULL,
  unit_price_cents INTEGER NOT NULL CHECK (unit_price_cents >= 0),
  vat_rate NUMERIC(5, 4) NOT NULL CHECK (vat_rate >= 0 AND vat_rate <= 1),
  stock_level INTEGER NOT NULL DEFAULT 0 CHECK (stock_level >= 0),
  weekly_sales INTEGER[] NOT NULL CHECK (array_length(weekly_sales, 1) = 12),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
