import { describe, expect, it } from 'vitest';
import { filterProducts } from './filterProducts.js';
import type { Product } from '../types.js';

const sampleCatalog: Product[] = [
  {
    id: 1,
    sku: 'BAK-101',
    name: 'Country Sourdough Loaf',
    category: 'Bakery',
    unitPriceCents: 650,
    vatRate: 0.05,
    stockLevel: 28,
    weeklySales: [42, 45, 48, 44, 51, 53, 49, 56, 58, 54, 60, 62]
  },
  {
    id: 2,
    sku: 'DAI-202',
    name: 'Barista Oat Drink 1L',
    category: 'Dairy & Eggs',
    unitPriceCents: 450,
    vatRate: 0.05,
    stockLevel: 48,
    weeklySales: [92, 96, 98, 104, 101, 108, 112, 115, 118, 121, 124, 129]
  },
  {
    id: 3,
    sku: 'SNK-604',
    name: 'Maple Pecan Oat Granola Bar',
    category: 'Snacks',
    unitPriceCents: 250,
    vatRate: 0.2,
    stockLevel: 75,
    weeklySales: [76, 79, 77, 81, 84, 82, 86, 88, 87, 90, 92, 94]
  }
];

describe('filterProducts', () => {
  it('returns all products when query is empty or whitespace', () => {
    expect(filterProducts(sampleCatalog, '   ')).toHaveLength(3);
  });

  it('matches products case-insensitively by partial product name', () => {
    const matches = filterProducts(sampleCatalog, 'oat');
    expect(matches.map((p) => p.sku)).toEqual(['DAI-202', 'SNK-604']);
  });

  it('matches products by exact or partial SKU and optional category filter', () => {
    const bySku = filterProducts(sampleCatalog, 'bak-101');
    expect(bySku).toHaveLength(1);
    expect(bySku[0].name).toBe('Country Sourdough Loaf');

    const byCategory = filterProducts(sampleCatalog, 'oat', 'Snacks');
    expect(byCategory.map((p) => p.sku)).toEqual(['SNK-604']);
  });
});
