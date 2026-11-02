export function formatPrice(cents: number, currency = 'USD'): string {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  return formatter.format(cents / 100);
}

export function computeVatInclusiveCents(unitPriceCents: number, vatRate: number): number {
  return Math.round(unitPriceCents * (1 + vatRate));
}
