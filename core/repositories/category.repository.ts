import { CategoryEntity, SubcategoryEntity } from '../entities/category.entity';

/**
 * Category Repository Interface
 */
export interface ICategoryRepository {
  /**
   * Get all categories
   */
  findAll(): Promise<CategoryEntity[]>;

  /**
   * Get category by ID
   */
  findById(id: number): Promise<CategoryEntity | null>;

  /**
   * Get category by key
   */
  findByKey(key: string): Promise<CategoryEntity | null>;

  /**
   * Get active categories
   */
  findActive(): Promise<CategoryEntity[]>;

  /**
   * Create category
   */
  create(data: {
    key: string;
    name: string;
    icon?: string;
    color?: string;
    sortOrder: number;
  }): Promise<CategoryEntity>;
}

/**
 * Subcategory Repository Interface
 */
export interface ISubcategoryRepository {
  /**
   * Get all subcategories
   */
  findAll(): Promise<SubcategoryEntity[]>;

  /**
   * Get subcategory by ID
   */
  findById(id: number): Promise<SubcategoryEntity | null>;

  /**
   * Get subcategories by category
   */
  findByCategory(categoryId: number): Promise<SubcategoryEntity[]>;

  /**
   * Get active subcategories by category
   */
  findActiveByCategoryId(categoryId: number): Promise<SubcategoryEntity[]>;

  /**
   * Create subcategory
   */
  create(data: { categoryId: number; name: string; sortOrder: number }): Promise<SubcategoryEntity>;
}
