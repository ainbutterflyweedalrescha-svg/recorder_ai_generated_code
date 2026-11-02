import type { CartItem, Product } from '../types.js';

export type CartAction =
  | { type: 'ADD_ITEM'; product: Product }
  | { type: 'INCREMENT_ITEM'; productId: number }
  | { type: 'DECREMENT_ITEM'; productId: number }
  | { type: 'CLEAR_CART' };

export interface CartTotals {
  subtotalCents: number;
  vatCents: number;
  totalCents: number;
  itemCount: number;
}

export function cartReducer(state: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingIndex = state.findIndex((item) => item.product.id === action.product.id);
      if (existingIndex === -1) {
        return [...state, { product: action.product, quantity: 1 }];
      }
      return state.map((item, idx) =>
        idx === existingIndex ? { ...item, quantity: item.quantity + 1 } : item
      );
    }
    case 'INCREMENT_ITEM': {
      return state.map((item) =>
        item.product.id === action.productId ? { ...item, quantity: item.quantity + 1 } : item
      );
    }
    case 'DECREMENT_ITEM': {
      return state
        .map((item) =>
          item.product.id === action.productId ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0);
    }
    case 'CLEAR_CART': {
      return [];
    }
  }
}

export function calculateCartTotals(items: CartItem[]): CartTotals {
  let subtotalCents = 0;
  let vatCents = 0;
  let itemCount = 0;

  for (const item of items) {
    const lineSubtotal = item.product.unitPriceCents * item.quantity;
    const lineVat = Math.round(lineSubtotal * item.product.vatRate);
    subtotalCents += lineSubtotal;
    vatCents += lineVat;
    itemCount += item.quantity;
  }

  return {
    subtotalCents,
    vatCents,
    totalCents: subtotalCents + vatCents,
    itemCount
  };
}
