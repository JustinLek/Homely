import { TransactionEntity } from '@/core/entities/transaction.entity';
import { TransactionRepository } from '@/core/repositories/transaction.repository';

export interface UpdateTransactionContextInput {
  id: number;
  userContext: string;
}

export interface UpdateTransactionContextOutput {
  transaction: TransactionEntity;
  success: boolean;
}

export class UpdateTransactionContextUseCase {
  constructor(private transactionRepository: TransactionRepository) {}

  async execute(input: UpdateTransactionContextInput): Promise<UpdateTransactionContextOutput> {
    const { id, userContext } = input;

    // Update the transaction context
    const updatedTransaction = await this.transactionRepository.updateUserContext(id, userContext);

    return {
      transaction: updatedTransaction,
      success: true,
    };
  }
}
