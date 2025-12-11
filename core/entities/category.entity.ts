/**
 * Category Entity - Domain model for expense categories
 */
export class CategoryEntity {
  constructor(
    public readonly id: number,
    public readonly key: string,
    public readonly name: string,
    public readonly icon: string | null,
    public readonly color: string | null,
    public readonly sortOrder: number,
    public readonly isActive: boolean,
    public readonly createdAt: Date
  ) {}

  /**
   * Check if category is active
   */
  isActiveCategory(): boolean {
    return this.isActive;
  }
}

/**
 * Subcategory Entity - Domain model for expense subcategories
 */
export class SubcategoryEntity {
  constructor(
    public readonly id: number,
    public readonly categoryId: number,
    public readonly name: string,
    public readonly sortOrder: number,
    public readonly isActive: boolean,
    public readonly createdAt: Date
  ) {}

  /**
   * Check if subcategory is active
   */
  isActiveSubcategory(): boolean {
    return this.isActive;
  }
}
