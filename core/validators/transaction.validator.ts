import { z } from 'zod';

/**
 * Transaction schema for validation
 */
export const transactionSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  description: z.string().min(1, 'Description is required').max(500, 'Description too long'),
  counterparty: z
    .string()
    .min(1, 'Counterparty is required')
    .max(200, 'Counterparty name too long'),
  amount: z.number(),
  accountId: z.number().int().positive().nullable(),
  categoryId: z.number().int().positive().nullable().optional(),
  subcategoryId: z.number().int().positive().nullable().optional(),
  userContext: z.string().max(1000, 'Context too long').nullable().optional(),
});

/**
 * Create transaction schema
 */
export const createTransactionSchema = transactionSchema;

/**
 * Update transaction category schema
 */
export const updateTransactionCategorySchema = z.object({
  id: z.number().int().positive('Invalid transaction ID'),
  categoryId: z.number().int().positive('Invalid category ID'),
  subcategoryId: z.number().int().positive('Invalid subcategory ID'),
});

/**
 * Update transaction context schema
 */
export const updateTransactionContextSchema = z.object({
  id: z.number().int().positive('Invalid transaction ID'),
  userContext: z.string().max(1000, 'Context too long'),
});

/**
 * Bulk update schema
 */
export const bulkUpdateTransactionsSchema = z.object({
  updates: z.array(updateTransactionCategorySchema).min(1, 'At least one update required'),
});

/**
 * Get transactions by month schema
 */
export const getTransactionsByMonthSchema = z.object({
  year: z.number().int().min(2000).max(2100),
  month: z.number().int().min(1).max(12),
});

/**
 * Transaction filter schema
 */
export const transactionFilterSchema = z.object({
  categoryId: z.number().int().positive().optional(),
  accountId: z.number().int().positive().optional(),
  startDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  endDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  minAmount: z.number().optional(),
  maxAmount: z.number().optional(),
  search: z.string().max(200).optional(),
});

/**
 * Type exports
 */
export type TransactionInput = z.infer<typeof transactionSchema>;
export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
export type UpdateTransactionCategoryInput = z.infer<typeof updateTransactionCategorySchema>;
export type UpdateTransactionContextInput = z.infer<typeof updateTransactionContextSchema>;
export type BulkUpdateTransactionsInput = z.infer<typeof bulkUpdateTransactionsSchema>;
export type GetTransactionsByMonthInput = z.infer<typeof getTransactionsByMonthSchema>;
export type TransactionFilterInput = z.infer<typeof transactionFilterSchema>;
