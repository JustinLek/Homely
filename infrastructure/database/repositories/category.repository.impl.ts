import { eq, asc } from 'drizzle-orm';
import { db } from '../drizzle/client';
import { categories, subcategories } from '../drizzle/schema';
import {
  ICategoryRepository,
  ISubcategoryRepository,
} from '@/core/repositories/category.repository';
import { CategoryEntity, SubcategoryEntity } from '@/core/entities/category.entity';
import { DatabaseError } from '@/core/lib/errors';

/**
 * Category Repository Implementation
 */
export class CategoryRepository implements ICategoryRepository {
  private mapToEntity(row: typeof categories.$inferSelect): CategoryEntity {
    return new CategoryEntity(
      row.id,
      row.key,
      row.name,
      row.icon,
      row.color,
      row.sortOrder,
      row.isActive,
      new Date(row.createdAt)
    );
  }

  async findAll(): Promise<CategoryEntity[]> {
    try {
      const rows = await db.select().from(categories).orderBy(asc(categories.sortOrder));
      return rows.map((row) => this.mapToEntity(row));
    } catch (error) {
      throw new DatabaseError('Failed to fetch categories', error);
    }
  }

  async findById(id: number): Promise<CategoryEntity | null> {
    try {
      const rows = await db.select().from(categories).where(eq(categories.id, id));
      return rows.length > 0 ? this.mapToEntity(rows[0]) : null;
    } catch (error) {
      throw new DatabaseError(`Failed to fetch category ${id}`, error);
    }
  }

  async findByKey(key: string): Promise<CategoryEntity | null> {
    try {
      const rows = await db.select().from(categories).where(eq(categories.key, key));
      return rows.length > 0 ? this.mapToEntity(rows[0]) : null;
    } catch (error) {
      throw new DatabaseError(`Failed to fetch category by key ${key}`, error);
    }
  }

  async findActive(): Promise<CategoryEntity[]> {
    try {
      const rows = await db
        .select()
        .from(categories)
        .where(eq(categories.isActive, true))
        .orderBy(asc(categories.sortOrder));
      return rows.map((row) => this.mapToEntity(row));
    } catch (error) {
      throw new DatabaseError('Failed to fetch active categories', error);
    }
  }

  async create(data: {
    key: string;
    name: string;
    icon?: string;
    color?: string;
    sortOrder: number;
  }): Promise<CategoryEntity> {
    try {
      const result = await db
        .insert(categories)
        .values({
          key: data.key,
          name: data.name,
          icon: data.icon ?? null,
          color: data.color ?? null,
          sortOrder: data.sortOrder,
        })
        .returning();

      return this.mapToEntity(result[0]);
    } catch (error) {
      throw new DatabaseError('Failed to create category', error);
    }
  }
}

/**
 * Subcategory Repository Implementation
 */
export class SubcategoryRepository implements ISubcategoryRepository {
  private mapToEntity(row: typeof subcategories.$inferSelect): SubcategoryEntity {
    return new SubcategoryEntity(
      row.id,
      row.categoryId,
      row.name,
      row.sortOrder,
      row.isActive,
      new Date(row.createdAt)
    );
  }

  async findAll(): Promise<SubcategoryEntity[]> {
    try {
      const rows = await db.select().from(subcategories).orderBy(asc(subcategories.sortOrder));
      return rows.map((row) => this.mapToEntity(row));
    } catch (error) {
      throw new DatabaseError('Failed to fetch subcategories', error);
    }
  }

  async findById(id: number): Promise<SubcategoryEntity | null> {
    try {
      const rows = await db.select().from(subcategories).where(eq(subcategories.id, id));
      return rows.length > 0 ? this.mapToEntity(rows[0]) : null;
    } catch (error) {
      throw new DatabaseError(`Failed to fetch subcategory ${id}`, error);
    }
  }

  async findByCategory(categoryId: number): Promise<SubcategoryEntity[]> {
    try {
      const rows = await db
        .select()
        .from(subcategories)
        .where(eq(subcategories.categoryId, categoryId))
        .orderBy(asc(subcategories.sortOrder));
      return rows.map((row) => this.mapToEntity(row));
    } catch (error) {
      throw new DatabaseError(`Failed to fetch subcategories for category ${categoryId}`, error);
    }
  }

  async findActiveByCategoryId(categoryId: number): Promise<SubcategoryEntity[]> {
    try {
      const rows = await db
        .select()
        .from(subcategories)
        .where(eq(subcategories.categoryId, categoryId))
        .where(eq(subcategories.isActive, true))
        .orderBy(asc(subcategories.sortOrder));
      return rows.map((row) => this.mapToEntity(row));
    } catch (error) {
      throw new DatabaseError(
        `Failed to fetch active subcategories for category ${categoryId}`,
        error
      );
    }
  }

  async create(data: {
    categoryId: number;
    name: string;
    sortOrder: number;
  }): Promise<SubcategoryEntity> {
    try {
      const result = await db
        .insert(subcategories)
        .values({
          categoryId: data.categoryId,
          name: data.name,
          sortOrder: data.sortOrder,
        })
        .returning();

      return this.mapToEntity(result[0]);
    } catch (error) {
      throw new DatabaseError('Failed to create subcategory', error);
    }
  }
}
