import type { Product } from '../types.js';

export function filterProducts(products: Product[], query: string, category?: string): Product[] {
  const normalizedQuery = query.trim().toLowerCase();

  return products.filter((product) => {
    if (category && category !== 'All' && product.category !== category) {
      return false;
    }
    if (!normalizedQuery) {
      return true;
    }
    const matchesName = product.name.toLowerCase().includes(normalizedQuery);
    const matchesSku = product.sku.toLowerCase().includes(normalizedQuery);
    return matchesName || matchesSku;
  });
}
