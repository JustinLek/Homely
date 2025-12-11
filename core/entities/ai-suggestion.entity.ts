/**
 * AI Suggestion Entity - Domain model for AI categorization suggestions
 */
export class AISuggestionEntity {
  constructor(
    public readonly categoryId: number,
    public readonly subcategoryId: number,
    public readonly confidence: number,
    public readonly reasoning: string | null,
    public readonly source: 'ai' | 'prefilter' | 'user'
  ) {}

  /**
   * Check if suggestion has high confidence
   */
  hasHighConfidence(): boolean {
    return this.confidence >= 0.9;
  }

  /**
   * Check if suggestion has medium confidence
   */
  hasMediumConfidence(): boolean {
    return this.confidence >= 0.7 && this.confidence < 0.9;
  }

  /**
   * Check if suggestion has low confidence
   */
  hasLowConfidence(): boolean {
    return this.confidence < 0.7;
  }

  /**
   * Get confidence level as string
   */
  getConfidenceLevel(): 'high' | 'medium' | 'low' {
    if (this.hasHighConfidence()) return 'high';
    if (this.hasMediumConfidence()) return 'medium';
    return 'low';
  }

  /**
   * Check if suggestion is from AI
   */
  isFromAI(): boolean {
    return this.source === 'ai';
  }

  /**
   * Check if suggestion is from prefilter
   */
  isFromPrefilter(): boolean {
    return this.source === 'prefilter';
  }

  /**
   * Check if suggestion is from user
   */
  isFromUser(): boolean {
    return this.source === 'user';
  }
}
