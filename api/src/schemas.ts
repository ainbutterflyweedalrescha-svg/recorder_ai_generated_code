import { z } from 'zod';

export const createSaleItemSchema = z.object({
  productId: z.number().int().positive(),
  quantity: z.number().int().positive().max(999)
});

export const createSaleSchema = z.object({
  storeId: z.number().int().positive(),
  cashierName: z.string().trim().min(1).max(100),
  paymentMethod: z.enum(['card', 'cash', 'contactless']),
  items: z.array(createSaleItemSchema).min(1)
});

export const saleIdParamSchema = z.object({
  id: z.coerce.number().int().positive()
});

export type CreateSaleInput = z.infer<typeof createSaleSchema>;
