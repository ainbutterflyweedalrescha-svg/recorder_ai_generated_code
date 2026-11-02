import type { CreateSalePayload, Product, SaleDetail, SaleSummary, Store } from './types.js';

const API_BASE = import.meta.env?.VITE_API_BASE_URL ?? '';

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json'
    },
    ...init
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as { error?: string };
    throw new Error(body.error ?? `Request failed with status ${response.status}`);
  }

  return (await response.json()) as T;
}

export async function fetchProducts(): Promise<Product[]> {
  const data = await requestJson<{ products: Product[] }>('/api/products');
  return data.products;
}

export async function fetchStores(): Promise<Store[]> {
  const data = await requestJson<{ stores: Store[] }>('/api/stores');
  return data.stores;
}

export async function fetchSales(): Promise<SaleSummary[]> {
  const data = await requestJson<{ sales: SaleSummary[] }>('/api/sales');
  return data.sales;
}

export async function fetchSaleById(id: number): Promise<SaleDetail> {
  const data = await requestJson<{ sale: SaleDetail }>(`/api/sales/${id}`);
  return data.sale;
}

export async function createSale(payload: CreateSalePayload): Promise<SaleDetail> {
  const data = await requestJson<{ sale: SaleDetail }>('/api/sales', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
  return data.sale;
}
