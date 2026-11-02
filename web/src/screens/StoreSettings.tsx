import { useQuery } from '@tanstack/react-query';
import { fetchStores } from '../api.js';
import styles from './StoreSettings.module.css';

export function StoreSettings() {
  const storesQuery = useQuery({
    queryKey: ['stores'],
    queryFn: fetchStores
  });

  const stores = storesQuery.data ?? [];

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <h2 className={styles.title}>Corner Shop Locations & Register Settings</h2>
        <p className={styles.subtitle}>
          Active store configurations for Harbor Street Retail Group
        </p>
      </header>

      <div className={styles.grid}>
        {stores.map((store) => (
          <section key={store.id} className={styles.storeCard}>
            <div className={styles.cardTop}>
              <span className={styles.codeBadge}>{store.code}</span>
              <span className={styles.currencyBadge}>{store.currency}</span>
            </div>
            <h3 className={styles.storeName}>{store.name}</h3>
            <dl className={styles.details}>
              <div>
                <dt>Address</dt>
                <dd>{store.address}</dd>
              </div>
              <div>
                <dt>Store Manager</dt>
                <dd>{store.managerName}</dd>
              </div>
              <div>
                <dt>Phone</dt>
                <dd>{store.phone}</dd>
              </div>
              <div>
                <dt>Opening Hours</dt>
                <dd>{store.openingHours}</dd>
              </div>
              <div>
                <dt>Receipt Footer</dt>
                <dd>{store.receiptFooter}</dd>
              </div>
            </dl>
          </section>
        ))}
      </div>
    </div>
  );
}
