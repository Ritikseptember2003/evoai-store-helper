import { z } from 'zod';

export const addToCartSchema = z.object({
  productId: z.string().min(1, 'Product ID is required.'),
  qty: z.number().int().min(1, 'Quantity must be at least 1.'),
});

export const orderStatusSchema = z.object({
  orderId: z.string().regex(/^ORD-\d{4}$/, 'Invalid Order ID format.'),
  email: z.string().email('Invalid email address.'),
});