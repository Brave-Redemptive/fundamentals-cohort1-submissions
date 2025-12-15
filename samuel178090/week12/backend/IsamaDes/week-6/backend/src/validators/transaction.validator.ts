
import { z } from 'zod';


export const TransactionSchema = z.object({
  body: z.object({
    userId: z.string().uuid(),
    productId: z.string().uuid(),
    amountCents: z.number().int().positive()
  })
});

export type TransactionInput = z.infer<typeof TransactionSchema>;


