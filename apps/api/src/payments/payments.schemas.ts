import { z } from 'zod';

export const recordPaymentSchema = z.object({
  saleId: z.string().trim().optional().nullable(),
  customerId: z.string().trim().optional().nullable(),
  amount: z.coerce.number().positive('Payment amount must be greater than 0.'),
  paymentMethod: z.enum(['CASH', 'UPI', 'CARD', 'BANK_TRANSFER']).default('CASH'),
  transactionRef: z.string().trim().max(100).optional().nullable(),
  notes: z.string().trim().max(250).optional().nullable(),
});

export class RecordPaymentDto {
  static schema = recordPaymentSchema;
  saleId?: string | null;
  customerId?: string | null;
  amount!: number;
  paymentMethod!: 'CASH' | 'UPI' | 'CARD' | 'BANK_TRANSFER';
  transactionRef?: string | null;
  notes?: string | null;
}

export type RecordPaymentInput = z.infer<typeof recordPaymentSchema>;

export const paymentsQuerySchema = z.object({
  search: z.string().trim().optional(),
  paymentMethod: z.string().trim().optional(),
});

export class PaymentsQueryDto {
  static schema = paymentsQuerySchema;
  search?: string;
  paymentMethod?: string;
}

export type PaymentsQueryInput = z.infer<typeof paymentsQuerySchema>;
