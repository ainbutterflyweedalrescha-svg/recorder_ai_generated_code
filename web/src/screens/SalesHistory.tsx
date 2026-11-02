import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchSaleById, fetchSales } from '../api.js';
import { formatPrice } from '../utils/formatPrice.js';
import styles from './SalesHistory.module.css';

export function SalesHistory() {
  const [selectedSaleId, setSelectedSaleId] = useState<number | null>(null);

  const salesQuery = useQuery({
    queryKey: ['sales'],
    queryFn: fetchSales
  });

  const saleDetailQuery = useQuery({
    queryKey: ['sale', selectedSaleId],
    queryFn: () => fetchSaleById(selectedSaleId!),
    enabled: selectedSaleId !== null
  });

  const sales = salesQuery.data ?? [];

  return (
    <div className={styles.container}>
      <div className={styles.tableCard}>
        <div className={styles.headerRow}>
          <h2 className={styles.heading}>Recent Sales History</h2>
          <span className={styles.badge}>{sales.length} transactions</span>
        </div>

        {salesQuery.isLoading ? (
          <p>Loading sales records...</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Receipt</th>
                <th>Store</th>
                <th>Cashier</th>
                <th>Payment</th>
                <th>Items</th>
                <th>Subtotal</th>
                <th>VAT</th>
                <th>Total</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((sale) => (
                <tr
                  key={sale.id}
                  className={selectedSaleId === sale.id ? styles.selectedRow : styles.row}
                  onClick={() => setSelectedSaleId(sale.id)}
                >
                  <td>#{sale.id}</td>
                  <td>{sale.storeName}</td>
                  <td>{sale.cashierName}</td>
                  <td className={styles.methodCell}>{sale.paymentMethod}</td>
                  <td>{sale.itemCount}</td>
                  <td>{formatPrice(sale.subtotalCents)}</td>
                  <td>{formatPrice(sale.vatCents)}</td>
                  <td className={styles.totalCell}>{formatPrice(sale.totalCents)}</td>
                  <td>{new Date(sale.createdAt).toLocaleString('en-US')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <aside className={styles.detailCard}>
        <h3 className={styles.detailTitle}>Receipt Inspector</h3>
        {selectedSaleId === null ? (
          <p className={styles.muted}>Select a transaction row to view its line items.</p>
        ) : saleDetailQuery.isLoading ? (
          <p className={styles.muted}>Loading receipt #{selectedSaleId}...</p>
        ) : saleDetailQuery.data ? (
          <div className={styles.receiptContent}>
            <p className={styles.receiptMeta}>
              <strong>Receipt #{saleDetailQuery.data.id}</strong> ·{' '}
              {saleDetailQuery.data.storeName}
            </p>
            <p className={styles.receiptMeta}>
              Cashier: {saleDetailQuery.data.cashierName} ({saleDetailQuery.data.paymentMethod})
            </p>
            <ul className={styles.itemList}>
              {saleDetailQuery.data.items.map((item) => (
                <li key={item.id} className={styles.itemRow}>
                  <span>
                    {item.quantity}x {item.productName} ({item.sku})
                  </span>
                  <span>{formatPrice(item.lineTotalCents)}</span>
                </li>
              ))}
            </ul>
            <div className={styles.receiptFooter}>
              <span>Total Paid (incl. VAT)</span>
              <strong>{formatPrice(saleDetailQuery.data.totalCents)}</strong>
            </div>
          </div>
        ) : null}
      </aside>
    </div>
  );
}
