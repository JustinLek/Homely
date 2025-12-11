'use server';

import { CategoryRepository } from '@/infrastructure/database/repositories/category.repository.impl';

// Initialize repositories
const categoryRepository = new CategoryRepository();

/**
 * Get all categories with their subcategories
 */
export async function getCategories() {
  try {
    const categories = await categoryRepository.findAll();

    return {
      success: true,
      categories: categories.map((cat) => ({
        id: cat.id,
        key: cat.key,
        name: cat.name,
        subcategories: cat.subcategories.map((sub) => ({
          id: sub.id,
          name: sub.name,
        })),
      })),
    };
  } catch (error) {
    console.error('Error getting categories:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get categories',
      categories: [],
    };
  }
}

/**
 * Get subcategories for a specific category
 */
export async function getSubcategories(categoryKey: string) {
  try {
    const category = await categoryRepository.findByKey(categoryKey);

    if (!category) {
      return {
        success: false,
        error: `Category ${categoryKey} not found`,
        subcategories: [],
      };
    }

    return {
      success: true,
      subcategories: category.subcategories.map((sub) => ({
        id: sub.id,
        name: sub.name,
      })),
    };
  } catch (error) {
    console.error('Error getting subcategories:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get subcategories',
      subcategories: [],
    };
  }
}
