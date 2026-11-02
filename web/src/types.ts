/// <reference types="vite/client" />

export interface Product {
  id: number;
  sku: string;
  name: string;
  category: string;
  unitPriceCents: number;
  vatRate: number;
  stockLevel: number;
  weeklySales: number[];
}

export interface Store {
  id: number;
  code: string;
  name: string;
  address: string;
  managerName: string;
  phone: string;
  currency: string;
  receiptFooter: string;
  openingHours: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface SaleSummary {
  id: number;
  storeId: number;
  storeName: string;
  cashierName: string;
  paymentMethod: 'card' | 'cash' | 'contactless';
  subtotalCents: number;
  vatCents: number;
  totalCents: number;
  itemCount: number;
  createdAt: string;
}

export interface SaleDetailItem {
  id: number;
  productId: number;
  productName: string;
  sku: string;
  quantity: number;
  unitPriceCents: number;
  vatRate: number;
  lineTotalCents: number;
}

export interface SaleDetail {
  id: number;
  storeId: number;
  storeName: string;
  cashierName: string;
  paymentMethod: 'card' | 'cash' | 'contactless';
  subtotalCents: number;
  vatCents: number;
  totalCents: number;
  createdAt: string;
  items: SaleDetailItem[];
}

export interface CreateSalePayload {
  storeId: number;
  cashierName: string;
  paymentMethod: 'card' | 'cash' | 'contactless';
  items: Array<{
    productId: number;
    quantity: number;
  }>;
}
