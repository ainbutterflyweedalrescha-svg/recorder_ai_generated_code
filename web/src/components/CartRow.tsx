import type { CartItem } from '../types.js';
import { formatPrice } from '../utils/formatPrice.js';
import styles from './CartRow.module.css';

export interface CartRowProps {
  item: CartItem;
  onIncrement: () => void;
  onDecrement: () => void;
}

export function CartRow({ item, onIncrement, onDecrement }: CartRowProps) {
  const lineTotalCents = item.product.unitPriceCents * item.quantity;

  return (
    <div className={styles.row}>
      <div className={styles.info}>
        <span className={styles.name}>{item.product.name}</span>
        <span className={styles.meta}>
          {item.product.sku} · {formatPrice(item.product.unitPriceCents)} each
        </span>
      </div>

      <div className={styles.controls}>
        <button
          type="button"
          className={styles.qtyButton}
          onClick={onDecrement}
          aria-label={`Decrease quantity of ${item.product.name}`}
        >
          -
        </button>
        <span className={styles.quantity}>{item.quantity}</span>
        <button
          type="button"
          className={styles.qtyButton}
          onClick={onIncrement}
          aria-label={`Increase quantity of ${item.product.name}`}
        >
          +
        </button>
      </div>

      <div className={styles.lineTotal}>{formatPrice(lineTotalCents)}</div>
    </div>
  );
}
