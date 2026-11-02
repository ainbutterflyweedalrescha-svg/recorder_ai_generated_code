import type { Product } from '../types.js';
import { computeVatInclusiveCents, formatPrice } from '../utils/formatPrice.js';
import styles from './ProductCard.module.css';

export interface ProductCardProps {
  product: Product;
  onAdd: () => void;
}

export function ProductCard({ product, onAdd }: ProductCardProps) {
  const unitPriceFormatted = formatPrice(product.unitPriceCents);
  const vatInclusiveCents = computeVatInclusiveCents(product.unitPriceCents, product.vatRate);
  const vatInclusiveFormatted = formatPrice(vatInclusiveCents);

  const width = 110;
  const height = 28;
  const values = product.weeklySales;
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const range = maxVal - minVal || 1;

  const sparklinePath = values
    .map((val, index) => {
      const x = (index / Math.max(values.length - 1, 1)) * (width - 6) + 3;
      const y = height - 4 - ((val - minVal) / range) * (height - 8);
      return `${index === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  const isLowStock = product.stockLevel <= 25;

  return (
    <article className={styles.card}>
      <div className={styles.topRow}>
        <span className={styles.categoryBadge}>{product.category}</span>
        <span className={isLowStock ? styles.stockBadgeLow : styles.stockBadge}>
          {product.stockLevel} in stock
        </span>
      </div>

      <h3 className={styles.name}>{product.name}</h3>
      <p className={styles.sku}>{product.sku}</p>

      <div className={styles.sparklineRow}>
        <svg
          className={styles.sparkline}
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          aria-label={`12-week sales trend for ${product.name}`}
        >
          <path d={sparklinePath} fill="none" stroke="#2563eb" strokeWidth="1.75" />
        </svg>
        <span className={styles.sparklineLabel}>12w trend</span>
      </div>

      <div className={styles.footer}>
        <div className={styles.pricing}>
          <span className={styles.unitPrice}>{unitPriceFormatted}</span>
          <span className={styles.vatPrice}>
            {vatInclusiveFormatted} incl. {Math.round(product.vatRate * 100)}% VAT
          </span>
        </div>
        <button
          type="button"
          className={styles.addButton}
          onClick={onAdd}
          disabled={product.stockLevel <= 0}
        >
          Add
        </button>
      </div>
    </article>
  );
}
