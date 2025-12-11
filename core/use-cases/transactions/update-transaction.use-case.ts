import { TransactionEntity } from '@/core/entities/transaction.entity';
import { TransactionRepository } from '@/core/repositories/transaction.repository';
import { CategoryRepository } from '@/core/repositories/category.repository';
import { SubcategoryRepository } from '@/core/repositories/subcategory.repository';

export interface UpdateTransactionInput {
  id: number;
  categoryKey?: string;
  subcategoryName?: string;
}

export interface UpdateTransactionOutput {
  transaction: TransactionEntity;
  success: boolean;
}

export class UpdateTransactionUseCase {
  constructor(
    private transactionRepository: TransactionRepository,
    private categoryRepository: CategoryRepository,
    private subcategoryRepository: SubcategoryRepository
  ) {}

  async execute(input: UpdateTransactionInput): Promise<UpdateTransactionOutput> {
    const { id, categoryKey, subcategoryName } = input;

    // Get the transaction
    const transaction = await this.transactionRepository.findById(id);
    if (!transaction) {
      throw new Error(`Transaction with id ${id} not found`);
    }

    // Get category and subcategory IDs
    let categoryId: number | undefined;
    let subcategoryId: number | undefined;

    if (categoryKey) {
      const category = await this.categoryRepository.findByKey(categoryKey);
      if (!category) {
        throw new Error(`Category with key ${categoryKey} not found`);
      }
      categoryId = category.id;
    }

    if (subcategoryName) {
      const subcategory = await this.subcategoryRepository.findByName(subcategoryName);
      if (!subcategory) {
        throw new Error(`Subcategory with name ${subcategoryName} not found`);
      }
      subcategoryId = subcategory.id;
    }

    // Update the transaction
    const updatedTransaction = await this.transactionRepository.update(id, {
      categoryId,
      subcategoryId,
    });

    return {
      transaction: updatedTransaction,
      success: true,
    };
  }
}
