import { TransactionRepository } from '@/core/repositories/transaction.repository';
import { CategoryRepository } from '@/core/repositories/category.repository';
import { SubcategoryRepository } from '@/core/repositories/subcategory.repository';

export interface BulkUpdateItem {
  id: number;
  categoryKey: string;
  subcategoryName: string;
}

export interface BulkUpdateTransactionsInput {
  updates: BulkUpdateItem[];
}

export interface BulkUpdateTransactionsOutput {
  updatedCount: number;
  success: boolean;
  errors: Array<{ id: number; error: string }>;
}

export class BulkUpdateTransactionsUseCase {
  constructor(
    private transactionRepository: TransactionRepository,
    private categoryRepository: CategoryRepository,
    private subcategoryRepository: SubcategoryRepository
  ) {}

  async execute(input: BulkUpdateTransactionsInput): Promise<BulkUpdateTransactionsOutput> {
    const { updates } = input;
    const errors: Array<{ id: number; error: string }> = [];
    let updatedCount = 0;

    for (const update of updates) {
      try {
        const { id, categoryKey, subcategoryName } = update;

        // Get category and subcategory IDs
        const category = await this.categoryRepository.findByKey(categoryKey);
        if (!category) {
          errors.push({ id, error: `Category ${categoryKey} not found` });
          continue;
        }

        const subcategory = await this.subcategoryRepository.findByName(subcategoryName);
        if (!subcategory) {
          errors.push({ id, error: `Subcategory ${subcategoryName} not found` });
          continue;
        }

        // Update the transaction
        await this.transactionRepository.update(id, {
          categoryId: category.id,
          subcategoryId: subcategory.id,
        });

        updatedCount++;
      } catch (error) {
        errors.push({
          id: update.id,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return {
      updatedCount,
      success: errors.length === 0,
      errors,
    };
  }
}
