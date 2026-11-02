import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createSale, fetchProducts, fetchStores } from '../api.js';
import { CartRow } from '../components/CartRow.js';
import { ProductCard } from '../components/ProductCard.js';
import { cartReducer } from '../state/cartReducer.js';
import type { CartItem } from '../types.js';
import { filterProducts } from '../utils/filterProducts.js';
import { formatPrice } from '../utils/formatPrice.js';
import styles from './Register.module.css';

export function Register() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedStoreId, setSelectedStoreId] = useState<number>(1);
  const [cashierName, setCashierName] = useState<string>('Dana Reyes');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash' | 'contactless'>('card');
  const [lastReceiptId, setLastReceiptId] = useState<number | null>(null);

  const productsQuery = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts
  });

  const storesQuery = useQuery({
    queryKey: ['stores'],
    queryFn: fetchStores
  });

  const chargeMutation = useMutation({
    mutationFn: createSale,
    onSuccess: (sale) => {
      setCart([]);
      setLastReceiptId(sale.id);
      void queryClient.invalidateQueries({ queryKey: ['products'] });
      void queryClient.invalidateQueries({ queryKey: ['sales'] });
    }
  });

  const products = productsQuery.data ?? [];
  const stores = storesQuery.data ?? [];
  const filteredProducts = filterProducts(products, searchQuery);

  let subtotalCents = 0;
  let vatCents = 0;
  for (const item of cart) {
    const lineSubtotal = item.product.unitPriceCents * item.quantity;
    const lineVat = Math.round(lineSubtotal * item.product.vatRate);
    subtotalCents += lineSubtotal;
    vatCents += lineVat;
  }
  const totalCents = subtotalCents + vatCents;

  return (
    <div className={styles.layout}>
      <section className={styles.catalogSection}>
        <div className={styles.searchBar}>
          <input
            type="search"
            className={styles.searchInput}
            placeholder="Search 40 products by name or SKU (e.g. BAK-101, sourdough)..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
          <span className={styles.resultCount}>
            Showing {filteredProducts.length} of {products.length} items
          </span>
        </div>

        {productsQuery.isLoading ? (
          <p className={styles.statusMessage}>Loading product catalog...</p>
        ) : productsQuery.isError ? (
          <p className={styles.errorMessage}>Unable to load products from the API.</p>
        ) : (
          <div className={styles.productGrid}>
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAdd={() =>
                  setCart((current) => cartReducer(current, { type: 'ADD_ITEM', product }))
                }
              />
            ))}
          </div>
        )}
      </section>

      <aside className={styles.cartPanel}>
        <div className={styles.cartHeader}>
          <h2 className={styles.cartTitle}>Current Sale</h2>
          <div className={styles.registerMeta}>
            <select
              className={styles.select}
              value={selectedStoreId}
              onChange={(event) => setSelectedStoreId(Number(event.target.value))}
              aria-label="Active store"
            >
              {stores.map((store) => (
                <option key={store.id} value={store.id}>
                  {store.name}
                </option>
              ))}
            </select>
            <select
              className={styles.select}
              value={cashierName}
              onChange={(event) => setCashierName(event.target.value)}
              aria-label="Active cashier"
            >
              <option value="Dana Reyes">Dana Reyes</option>
              <option value="Marcus Vance">Marcus Vance</option>
              <option value="Tessa Lindqvist">Tessa Lindqvist</option>
              <option value="Omar Haddad">Omar Haddad</option>
            </select>
          </div>
        </div>

        <div className={styles.cartList}>
          {cart.length === 0 ? (
            <p className={styles.emptyCart}>No items in basket. Select products from the grid.</p>
          ) : (
            cart.map((item) => (
              <CartRow
                key={item.product.id}
                item={item}
                onIncrement={() =>
                  setCart((current) =>
                    cartReducer(current, {
                      type: 'INCREMENT_ITEM',
                      productId: item.product.id
                    })
                  )
                }
                onDecrement={() =>
                  setCart((current) =>
                    cartReducer(current, {
                      type: 'DECREMENT_ITEM',
                      productId: item.product.id
                    })
                  )
                }
              />
            ))
          )}
        </div>

        <div className={styles.paymentRow}>
          {(['card', 'contactless', 'cash'] as const).map((method) => (
            <button
              key={method}
              type="button"
              className={
                paymentMethod === method ? styles.paymentBtnActive : styles.paymentBtn
              }
              onClick={() => setPaymentMethod(method)}
            >
              {method}
            </button>
          ))}
        </div>

        <div className={styles.totalsBox}>
          <div className={styles.totalLine}>
            <span>Subtotal</span>
            <span>{formatPrice(subtotalCents)}</span>
          </div>
          <div className={styles.totalLine}>
            <span>VAT</span>
            <span>{formatPrice(vatCents)}</span>
          </div>
          <div className={styles.grandTotalLine}>
            <span>Total</span>
            <span>{formatPrice(totalCents)}</span>
          </div>
        </div>

        {lastReceiptId !== null && (
          <p className={styles.receiptBanner}>Recorded sale #{lastReceiptId}</p>
        )}

        {chargeMutation.isError && (
          <p className={styles.errorMessage}>{chargeMutation.error.message}</p>
        )}

        <button
          type="button"
          className={styles.chargeButton}
          disabled={cart.length === 0 || chargeMutation.isPending}
          onClick={() =>
            chargeMutation.mutate({
              storeId: selectedStoreId,
              cashierName,
              paymentMethod,
              items: cart.map((item) => ({
                productId: item.product.id,
                quantity: item.quantity
              }))
            })
          }
        >
          {chargeMutation.isPending
            ? 'Processing...'
            : `Charge ${formatPrice(totalCents)}`}
        </button>
      </aside>
    </div>
  );
}
