import { z } from 'zod';

/**
 * Category schema
 */
export const categorySchema = z.object({
  key: z.string().min(1, 'Key is required').max(100, 'Key too long'),
  name: z.string().min(1, 'Name is required').max(200, 'Name too long'),
  icon: z.string().max(10).optional(),
  color: z.string().max(50).optional(),
  sortOrder: z.number().int().min(0),
});

/**
 * Subcategory schema
 */
export const subcategorySchema = z.object({
  categoryId: z.number().int().positive('Invalid category ID'),
  name: z.string().min(1, 'Name is required').max(200, 'Name too long'),
  sortOrder: z.number().int().min(0),
});

/**
 * Type exports
 */
export type CategoryInput = z.infer<typeof categorySchema>;
export type SubcategoryInput = z.infer<typeof subcategorySchema>;
