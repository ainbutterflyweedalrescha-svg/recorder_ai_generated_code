import { describe, expect, it } from 'vitest';
import { calculateCartTotals, cartReducer } from './cartReducer.js';
import type { Product } from '../types.js';

const sourdough: Product = {
  id: 1,
  sku: 'BAK-101',
  name: 'Country Sourdough Loaf',
  category: 'Bakery',
  unitPriceCents: 650,
  vatRate: 0.05,
  stockLevel: 28,
  weeklySales: [42, 45, 48, 44, 51, 53, 49, 56, 58, 54, 60, 62]
};

const coldBrew: Product = {
  id: 19,
  sku: 'BEV-401',
  name: 'Cold Brew Coffee Can 250ml',
  category: 'Beverages',
  unitPriceCents: 330,
  vatRate: 0.2,
  stockLevel: 72,
  weeklySales: [95, 98, 102, 106, 110, 108, 114, 118, 120, 123, 126, 130]
};

describe('cartReducer', () => {
  it('adds a new product with quantity 1 and increments if added again', () => {
    const first = cartReducer([], { type: 'ADD_ITEM', product: sourdough });
    expect(first).toHaveLength(1);
    expect(first[0].quantity).toBe(1);

    const second = cartReducer(first, { type: 'ADD_ITEM', product: sourdough });
    expect(second).toHaveLength(1);
    expect(second[0].quantity).toBe(2);
  });

  it('increments an existing line item by productId', () => {
    const initial = [{ product: sourdough, quantity: 2 }];
    const next = cartReducer(initial, { type: 'INCREMENT_ITEM', productId: sourdough.id });
    expect(next[0].quantity).toBe(3);
  });

  it('decrements quantity and removes the row when quantity reaches zero', () => {
    const initial = [{ product: sourdough, quantity: 2 }];
    const afterOne = cartReducer(initial, { type: 'DECREMENT_ITEM', productId: sourdough.id });
    expect(afterOne[0].quantity).toBe(1);

    const afterZero = cartReducer(afterOne, { type: 'DECREMENT_ITEM', productId: sourdough.id });
    expect(afterZero).toHaveLength(0);
  });

  it('calculates subtotal, VAT, and grand total across mixed VAT rates', () => {
    const cart = [
      { product: sourdough, quantity: 2 },
      { product: coldBrew, quantity: 1 }
    ];
    const totals = calculateCartTotals(cart);

    expect(totals.subtotalCents).toBe(1630);
    expect(totals.vatCents).toBe(131);
    expect(totals.totalCents).toBe(1761);
    expect(totals.itemCount).toBe(3);
  });
});
