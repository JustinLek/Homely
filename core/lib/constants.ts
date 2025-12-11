/**
 * Application constants
 */

export const APP_NAME = 'Gezinsuitgaven';
export const APP_DESCRIPTION = 'Beheer en categoriseer je gezinsuitgaven';

/**
 * Category colors for UI
 */
export const CATEGORY_COLORS: Record<string, string> = {
  woning: 'bg-blue-500',
  energie_lokale_lasten: 'bg-yellow-500',
  verzekeringen: 'bg-green-500',
  abonnementen_telecom: 'bg-purple-500',
  onderwijs: 'bg-pink-500',
  vervoer: 'bg-red-500',
  overige_vaste_lasten: 'bg-indigo-500',
  kleding_schoenen: 'bg-cyan-500',
  inboedel_huis_tuin: 'bg-teal-500',
  niet_vergoede_ziektekosten: 'bg-orange-500',
  vrijetijdsuitgaven: 'bg-lime-500',
  huishoudelijke_uitgaven: 'bg-emerald-500',
  interne_transacties: 'bg-gray-500',
  inkomsten: 'bg-green-600',
  te_beoordelen: 'bg-slate-400',
};

/**
 * Category icons
 */
export const CATEGORY_ICONS: Record<string, string> = {
  woning: '🏠',
  energie_lokale_lasten: '⚡',
  verzekeringen: '🛡️',
  abonnementen_telecom: '📱',
  onderwijs: '📚',
  vervoer: '🚗',
  overige_vaste_lasten: '💼',
  kleding_schoenen: '👕',
  inboedel_huis_tuin: '🛋️',
  niet_vergoede_ziektekosten: '🏥',
  vrijetijdsuitgaven: '🎉',
  huishoudelijke_uitgaven: '🛒',
  interne_transacties: '🔄',
  inkomsten: '💰',
  te_beoordelen: '❓',
};

/**
 * Account colors
 */
export const ACCOUNT_COLORS: Record<string, string> = {
  ING: 'bg-orange-500',
  Rabobank: 'bg-blue-700',
};

/**
 * AI confidence thresholds
 */
export const AI_CONFIDENCE = {
  HIGH: 0.9,
  MEDIUM: 0.7,
  LOW: 0.5,
} as const;

/**
 * Cache settings
 */
export const CACHE_SETTINGS = {
  AI_SUGGESTION_TTL_DAYS: 30,
  PREFILTER_CONFIDENCE: 1.0,
} as const;

/**
 * Pagination settings
 */
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 50,
  MAX_PAGE_SIZE: 100,
} as const;

/**
 * Date formats
 */
export const DATE_FORMATS = {
  MONTH_KEY: 'YYYY-MM',
  DISPLAY: 'DD-MM-YYYY',
  ISO: 'YYYY-MM-DD',
} as const;
