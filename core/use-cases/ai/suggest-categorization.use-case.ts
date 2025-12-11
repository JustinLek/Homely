import { ITransactionRepository } from '@/core/repositories/transaction.repository';
import { ICategoryRepository } from '@/core/repositories/category.repository';
import OpenAI from 'openai';

export interface SuggestCategorizationInput {
  transaction: {
    counterparty: string;
    amount: number;
    description?: string;
    userContext?: string;
  };
  skipCache?: boolean;
}

export interface CategorizationSuggestion {
  category: string;
  subcategory: string;
  confidence: number;
  reasoning: string;
}

export interface SuggestCategorizationOutput {
  suggestion: CategorizationSuggestion;
  source: 'prefilter' | 'cache' | 'ai';
  success: boolean;
}

export class SuggestCategorizationUseCase {
  private openai: OpenAI;

  constructor(
    private transactionRepository: ITransactionRepository,
    private categoryRepository: ICategoryRepository,
    apiKey: string
  ) {
    this.openai = new OpenAI({ apiKey });
  }

  async execute(input: SuggestCategorizationInput): Promise<SuggestCategorizationOutput> {
    const { transaction, skipCache = false } = input;

    // Step 1: Check prefilter (instant, free)
    if (!skipCache) {
      const prefilterMatch = this.checkPrefilter(transaction.counterparty);
      if (prefilterMatch) {
        return {
          suggestion: prefilterMatch,
          source: 'prefilter',
          success: true,
        };
      }
    }

    // Step 2: Check cache (fast, free)
    if (!skipCache) {
      const cachedSuggestion = await this.getCachedSuggestion(transaction.counterparty);
      if (cachedSuggestion) {
        return {
          suggestion: cachedSuggestion,
          source: 'cache',
          success: true,
        };
      }
    }

    // Step 3: Use AI (slow, costs money)
    const aiSuggestion = await this.getAISuggestion(transaction);

    // Save to cache for future use
    await this.saveSuggestionToCache(
      transaction.counterparty,
      aiSuggestion.category,
      aiSuggestion.subcategory,
      aiSuggestion.confidence,
      aiSuggestion.reasoning
    );

    return {
      suggestion: aiSuggestion,
      source: 'ai',
      success: true,
    };
  }

  private checkPrefilter(counterparty: string): CategorizationSuggestion | null {
    // Pre-defined categorizations for obvious matches
    const OBVIOUS_MATCHES: Record<string, { category: string; subcategory: string }> = {
      // Supermarkten
      'albert heijn': { category: 'huishoudelijke_uitgaven', subcategory: 'Boodschappen' },
      ah: { category: 'huishoudelijke_uitgaven', subcategory: 'Boodschappen' },
      jumbo: { category: 'huishoudelijke_uitgaven', subcategory: 'Boodschappen' },
      lidl: { category: 'huishoudelijke_uitgaven', subcategory: 'Boodschappen' },
      aldi: { category: 'huishoudelijke_uitgaven', subcategory: 'Boodschappen' },
      // Streaming
      spotify: { category: 'abonnementen_telecom', subcategory: 'Streamingsdiensten' },
      netflix: { category: 'abonnementen_telecom', subcategory: 'Streamingsdiensten' },
      // Energie
      tibber: { category: 'energie_lokale_lasten', subcategory: 'Gas / Elektriciteit' },
      eneco: { category: 'energie_lokale_lasten', subcategory: 'Gas / Elektriciteit' },
      // Add more as needed...
    };

    const normalized = counterparty
      .toLowerCase()
      .replace(/\d+/g, '')
      .replace(/[^a-z\s]/g, '')
      .trim();

    // Check for exact or partial matches
    for (const [key, value] of Object.entries(OBVIOUS_MATCHES)) {
      if (normalized.includes(key) || key.includes(normalized)) {
        return {
          ...value,
          confidence: 1.0,
          reasoning: 'Automatisch herkend op basis van bekende tegenpartij',
        };
      }
    }

    return null;
  }

  private async getCachedSuggestion(
    counterparty: string
  ): Promise<CategorizationSuggestion | null> {
    // Find similar categorized transactions
    const similarTransactions = await this.transactionRepository.findSimilar(counterparty, 1);

    if (similarTransactions.length > 0 && similarTransactions[0].category) {
      const transaction = similarTransactions[0];
      return {
        category: transaction.category.key,
        subcategory: transaction.subcategory?.name || 'Onbekend',
        confidence: 0.95,
        reasoning: 'Gebaseerd op eerdere categorisatie van vergelijkbare transactie',
      };
    }

    return null;
  }

  private async getAISuggestion(transaction: {
    counterparty: string;
    amount: number;
    description?: string;
    userContext?: string;
  }): Promise<CategorizationSuggestion> {
    // Get all categories for the prompt
    const categories = await this.categoryRepository.findAll();

    // Get similar transactions for context
    const similarTransactions = await this.transactionRepository.findSimilar(
      transaction.counterparty,
      5
    );

    // Build the prompt
    const categoriesText = categories
      .map(
        (cat) =>
          `- ${cat.key}: ${cat.name}\n  Subcategorieën: ${cat.subcategories.map((s) => s.name).join(', ')}`
      )
      .join('\n');

    const similarText =
      similarTransactions.length > 0
        ? `\n\nVoorbeelden van vergelijkbare transacties die je al hebt gecategoriseerd:\n${similarTransactions
            .map((t) => `- ${t.counterparty}: ${t.category?.name} > ${t.subcategory?.name}`)
            .join('\n')}`
        : '';

    const contextText = transaction.userContext
      ? `\n\nExtra context van gebruiker: ${transaction.userContext}`
      : '';

    const prompt = `Categoriseer de volgende Nederlandse banktransactie:

Tegenpartij: ${transaction.counterparty}
Bedrag: €${transaction.amount.toFixed(2)}
${transaction.description ? `Omschrijving: ${transaction.description}` : ''}${contextText}

Beschikbare categorieën:
${categoriesText}${similarText}

${similarTransactions.length > 0 ? '⚠️ HERHALING: Als er voorbeelden zijn van vergelijkbare transacties hierboven, gebruik dan DEZELFDE categorisatie. De gebruiker heeft deze al gecategoriseerd en weet beter dan jij wat de transactie inhoudt!\n\n' : ''}
Geef je antwoord in het volgende JSON formaat:
{
  "category": "category_key",
  "subcategory": "Subcategorie naam",
  "confidence": 0.95,
  "reasoning": "Korte uitleg waarom deze categorisatie past"
}

Belangrijke regels:
- Gebruik alleen de category_key zoals hierboven gedefinieerd
- Gebruik alleen subcategorieën die bij die categorie horen
- Confidence moet tussen 0 en 1 zijn (1 = zeer zeker)
- Geef een Nederlandse uitleg in reasoning
- Als het een interne overboeking lijkt, gebruik dan category "interne_transacties"`;

    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'Je bent een expert in het categoriseren van Nederlandse financiële transacties. Geef altijd antwoord in geldig JSON formaat.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' },
    });

    const suggestion = JSON.parse(completion.choices[0].message.content || '{}');

    // Validate the suggestion
    const category = categories.find((c) => c.key === suggestion.category);
    if (!category) {
      throw new Error('Invalid category suggested by AI');
    }

    const subcategory = category.subcategories.find((s) => s.name === suggestion.subcategory);
    if (!subcategory) {
      // Fallback to first subcategory if invalid
      suggestion.subcategory = category.subcategories[0]?.name || 'Onbekend';
    }

    return {
      category: suggestion.category,
      subcategory: suggestion.subcategory,
      confidence: suggestion.confidence || 0.8,
      reasoning: suggestion.reasoning || 'AI categorisatie',
    };
  }

  private async saveSuggestionToCache(
    counterparty: string,
    category: string,
    subcategory: string,
    confidence: number,
    reasoning: string
  ): Promise<void> {
    // This would save to a cache table in the database
    // For now, we'll skip this implementation as it requires a new table
    // TODO: Implement cache table
  }
}
