CREATE TABLE IF NOT EXISTS sales (
  id SERIAL PRIMARY KEY,
  store_id INTEGER NOT NULL REFERENCES stores(id) ON DELETE RESTRICT,
  cashier_name VARCHAR(100) NOT NULL,
  payment_method VARCHAR(32) NOT NULL CHECK (payment_method IN ('card', 'cash', 'contactless')),
  subtotal_cents INTEGER NOT NULL CHECK (subtotal_cents >= 0),
  vat_cents INTEGER NOT NULL CHECK (vat_cents >= 0),
  total_cents INTEGER NOT NULL CHECK (total_cents >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sales_store_created ON sales(store_id, created_at DESC);
