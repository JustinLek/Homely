import { AISuggestionEntity } from '../entities/ai-suggestion.entity';

/**
 * AI Cache Repository Interface
 */
export interface IAICacheRepository {
  /**
   * Get cached suggestion by normalized counterparty
   */
  findByCounterparty(counterpartyNormalized: string): Promise<AISuggestionEntity | null>;

  /**
   * Save suggestion to cache
   */
  save(
    counterpartyNormalized: string,
    categoryId: number,
    subcategoryId: number,
    confidence: number,
    reasoning: string | null,
    source: 'ai' | 'prefilter' | 'user'
  ): Promise<void>;

  /**
   * Clear old cache entries
   */
  clearOld(daysOld: number): Promise<void>;

  /**
   * Get cache statistics
   */
  getStats(): Promise<{
    total: number;
    recent: number;
  }>;
}
