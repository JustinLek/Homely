import { eq, sql, lt } from 'drizzle-orm';
import { db } from '../drizzle/client';
import { aiSuggestionsCache } from '../drizzle/schema';
import { IAICacheRepository } from '@/core/repositories/ai-cache.repository';
import { AISuggestionEntity } from '@/core/entities/ai-suggestion.entity';
import { DatabaseError } from '@/core/lib/errors';

/**
 * AI Cache Repository Implementation
 */
export class AICacheRepository implements IAICacheRepository {
  private mapToEntity(row: typeof aiSuggestionsCache.$inferSelect): AISuggestionEntity {
    return new AISuggestionEntity(
      row.categoryId,
      row.subcategoryId,
      row.confidence,
      row.reasoning,
      row.source as 'ai' | 'prefilter' | 'user'
    );
  }

  async findByCounterparty(counterpartyNormalized: string): Promise<AISuggestionEntity | null> {
    try {
      const thirtyDaysAgo = Math.floor(Date.now() / 1000) - 30 * 24 * 60 * 60;

      const rows = await db
        .select()
        .from(aiSuggestionsCache)
        .where(eq(aiSuggestionsCache.counterpartyNormalized, counterpartyNormalized))
        .where(sql`${aiSuggestionsCache.createdAt} > ${thirtyDaysAgo}`);

      return rows.length > 0 ? this.mapToEntity(rows[0]) : null;
    } catch (error) {
      throw new DatabaseError('Failed to fetch cached suggestion', error);
    }
  }

  async save(
    counterpartyNormalized: string,
    categoryId: number,
    subcategoryId: number,
    confidence: number,
    reasoning: string | null,
    source: 'ai' | 'prefilter' | 'user'
  ): Promise<void> {
    try {
      await db
        .insert(aiSuggestionsCache)
        .values({
          counterpartyNormalized,
          categoryId,
          subcategoryId,
          confidence,
          reasoning,
          source,
        })
        .onConflictDoUpdate({
          target: aiSuggestionsCache.counterpartyNormalized,
          set: {
            categoryId,
            subcategoryId,
            confidence,
            reasoning,
            source,
            createdAt: sql`(unixepoch())`,
          },
        });
    } catch (error) {
      throw new DatabaseError('Failed to save suggestion to cache', error);
    }
  }

  async clearOld(daysOld: number): Promise<void> {
    try {
      const cutoffTimestamp = Math.floor(Date.now() / 1000) - daysOld * 24 * 60 * 60;

      await db.delete(aiSuggestionsCache).where(lt(aiSuggestionsCache.createdAt, cutoffTimestamp));
    } catch (error) {
      throw new DatabaseError('Failed to clear old cache entries', error);
    }
  }

  async getStats(): Promise<{ total: number; recent: number }> {
    try {
      const sevenDaysAgo = Math.floor(Date.now() / 1000) - 7 * 24 * 60 * 60;

      const totalResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(aiSuggestionsCache);

      const recentResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(aiSuggestionsCache)
        .where(sql`${aiSuggestionsCache.createdAt} > ${sevenDaysAgo}`);

      return {
        total: totalResult[0].count,
        recent: recentResult[0].count,
      };
    } catch (error) {
      throw new DatabaseError('Failed to get cache stats', error);
    }
  }
}
