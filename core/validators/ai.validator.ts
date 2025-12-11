import { z } from 'zod';

/**
 * AI suggestion request schema
 */
export const aiSuggestionRequestSchema = z.object({
  transactionId: z.number().int().positive('Invalid transaction ID'),
  skipCache: z.boolean().optional().default(false),
});

/**
 * AI suggestion response schema
 */
export const aiSuggestionResponseSchema = z.object({
  categoryId: z.number().int().positive(),
  subcategoryId: z.number().int().positive(),
  confidence: z.number().min(0).max(1),
  reasoning: z.string().optional(),
  source: z.enum(['ai', 'prefilter', 'cache']),
});

/**
 * Bulk AI suggestion request schema
 */
export const bulkAiSuggestionRequestSchema = z.object({
  transactionIds: z.array(z.number().int().positive()).min(1, 'At least one transaction required'),
  skipCache: z.boolean().optional().default(false),
});

/**
 * Type exports
 */
export type AISuggestionRequest = z.infer<typeof aiSuggestionRequestSchema>;
export type AISuggestionResponse = z.infer<typeof aiSuggestionResponseSchema>;
export type BulkAISuggestionRequest = z.infer<typeof bulkAiSuggestionRequestSchema>;
