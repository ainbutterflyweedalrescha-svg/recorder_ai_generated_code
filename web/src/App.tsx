import { NavLink, Route, Routes } from 'react-router-dom';
import { Products } from './screens/Products.js';
import { Register } from './screens/Register.js';
import { SalesHistory } from './screens/SalesHistory.js';
import { StoreSettings } from './screens/StoreSettings.js';
import styles from './App.module.css';

export function App() {
  return (
    <div className={styles.shell}>
      <header className={styles.navbar}>
        <div className={styles.brand}>
          <span className={styles.logoMark}>RF</span>
          <div>
            <h1 className={styles.brandTitle}>RegisterFlow</h1>
            <span className={styles.brandSubtitle}>Harbor Street Retail Group POS</span>
          </div>
        </div>

        <nav className={styles.navLinks}>
          <NavLink
            to="/"
            end
            className={({ isActive }) => (isActive ? styles.activeLink : styles.link)}
          >
            Register
          </NavLink>
          <NavLink
            to="/sales"
            className={({ isActive }) => (isActive ? styles.activeLink : styles.link)}
          >
            Sales history
          </NavLink>
          <NavLink
            to="/products"
            className={({ isActive }) => (isActive ? styles.activeLink : styles.link)}
          >
            Products
          </NavLink>
          <NavLink
            to="/settings"
            className={({ isActive }) => (isActive ? styles.activeLink : styles.link)}
          >
            Store settings
          </NavLink>
        </nav>
      </header>

      <main className={styles.main}>
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/sales" element={<SalesHistory />} />
          <Route path="/products" element={<Products />} />
          <Route path="/settings" element={<StoreSettings />} />
        </Routes>
      </main>
    </div>
  );
}
