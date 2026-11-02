import { describe, expect, it } from 'vitest';
import { computeVatInclusiveCents, formatPrice } from './formatPrice.js';

describe('formatPrice and VAT helpers', () => {
  it('formats integer cents into USD currency strings', () => {
    expect(formatPrice(0)).toBe('$0.00');
    expect(formatPrice(650)).toBe('$6.50');
    expect(formatPrice(1290)).toBe('$12.90');
  });

  it('formats large multi-thousand cent values with thousands separators', () => {
    expect(formatPrice(125450)).toBe('$1,254.50');
  });

  it('computes rounded VAT-inclusive cents accurately', () => {
    expect(computeVatInclusiveCents(650, 0.05)).toBe(683);
    expect(computeVatInclusiveCents(330, 0.2)).toBe(396);
    expect(computeVatInclusiveCents(490, 0)).toBe(490);
  });
});
