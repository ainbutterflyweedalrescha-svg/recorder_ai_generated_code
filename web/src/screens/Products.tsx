import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '../api.js';
import { filterProducts } from '../utils/filterProducts.js';
import { computeVatInclusiveCents, formatPrice } from '../utils/formatPrice.js';
import styles from './Products.module.css';

const CATEGORIES = [
  'All',
  'Bakery',
  'Dairy & Eggs',
  'Produce',
  'Beverages',
  'Pantry',
  'Snacks',
  'Household'
];

export function Products() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');

  const productsQuery = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts
  });

  const products = productsQuery.data ?? [];
  const filtered = filterProducts(products, query, category);

  return (
    <div className={styles.card}>
      <div className={styles.toolbar}>
        <div>
          <h2 className={styles.title}>Inventory & Pricing Catalog</h2>
          <p className={styles.subtitle}>
            {filtered.length} of {products.length} active SKUs across Harbor Street Retail Group
          </p>
        </div>

        <div className={styles.controls}>
          <input
            type="search"
            className={styles.search}
            placeholder="Filter by name or SKU..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <select
            className={styles.select}
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>SKU</th>
            <th>Product Name</th>
            <th>Category</th>
            <th>Net Price</th>
            <th>VAT Rate</th>
            <th>Gross Price</th>
            <th>Stock On Hand</th>
            <th>12-Week Total Units</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((product) => {
            const grossCents = computeVatInclusiveCents(product.unitPriceCents, product.vatRate);
            const total12WeekUnits = product.weeklySales.reduce((acc, qty) => acc + qty, 0);

            return (
              <tr key={product.id}>
                <td className={styles.mono}>{product.sku}</td>
                <td className={styles.productName}>{product.name}</td>
                <td>{product.category}</td>
                <td>{formatPrice(product.unitPriceCents)}</td>
                <td>{Math.round(product.vatRate * 100)}%</td>
                <td>{formatPrice(grossCents)}</td>
                <td>{product.stockLevel}</td>
                <td>{total12WeekUnits}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
