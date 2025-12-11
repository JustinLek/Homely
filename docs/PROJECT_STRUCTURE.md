# Project Structure

## 📁 Root Directory

```
Gezinsuitgaven/
├── app/                    # Next.js App Router (pages & layouts)
├── application/            # Application Layer (Server Actions)
├── core/                   # Domain Layer (Entities, Use Cases, Repositories)
│   ├── constants/         # App constants (CATEGORIES, MONTHS)
│   ├── entities/          # Domain models
│   ├── use-cases/         # Business logic
│   ├── repositories/      # Repository interfaces
│   ├── validators/        # Zod schemas
│   └── lib/               # Core utilities
├── data/                   # SQLite database
├── docs/                   # Documentatie
├── infrastructure/         # Infrastructure Layer (Database implementations)
├── node_modules/           # Dependencies
├── presentation/           # Presentation Layer (UI Components)
│   ├── components/        # React components
│   └── types/             # Presentation types
├── public/                 # Static assets
├── scripts/                # Database & import scripts
├── .env                    # Environment variables
├── .env.local.example      # Environment template
├── .eslintignore           # ESLint ignore rules
├── .eslintrc.json          # ESLint configuration (legacy)
├── .gitignore              # Git ignore rules
├── .husky/                 # Git hooks
├── .prettierignore         # Prettier ignore rules
├── .prettierrc             # Prettier configuration
├── drizzle.config.ts       # Drizzle ORM configuration
├── eslint.config.mjs       # ESLint configuration
├── next.config.ts          # Next.js configuration
├── package.json            # Dependencies & scripts
├── postcss.config.mjs      # PostCSS configuration
├── README.md               # Project README
└── tsconfig.json           # TypeScript configuration
```

## 🏗️ Clean Architecture Layers

```
core/                              # Domain Layer
├── constants/                     # App constants
│   ├── categories.ts             # CATEGORIES Record
│   ├── months.ts                 # MONTHS Record
│   └── index.ts                  # Re-exports
├── entities/                      # Domain models met business logic
│   ├── transaction.entity.ts
│   ├── category.entity.ts
│   └── ai-suggestion.entity.ts
├── use-cases/                     # Business use cases
│   ├── transactions/
│   │   ├── get-transactions.use-case.ts
│   │   ├── update-transaction.use-case.ts
│   │   ├── update-transaction-context.use-case.ts
│   │   └── bulk-update-transactions.use-case.ts
│   ├── insights/
│   │   └── get-monthly-insights.use-case.ts
│   └── ai/
│       └── suggest-categorization.use-case.ts
├── repositories/                  # Repository interfaces
│   ├── transaction.repository.ts
│   ├── category.repository.ts
│   ├── subcategory.repository.ts
│   ├── account.repository.ts
│   └── ai-cache.repository.ts
├── validators/                    # Zod schemas
│   ├── transaction.validator.ts
│   ├── category.validator.ts
│   └── ai.validator.ts
└── lib/                          # Core utilities
    ├── utils.ts                  # Helper functions
    ├── errors.ts                 # Error classes
    └── constants.ts              # App constants

infrastructure/                    # Infrastructure Layer
└── database/
    ├── drizzle/
    │   ├── schema.ts             # Database schema
    │   ├── client.ts             # Drizzle client
    │   └── migrations/           # SQL migrations
    └── repositories/             # Repository implementations
        ├── transaction.repository.impl.ts
        ├── category.repository.impl.ts
        ├── subcategory.repository.impl.ts
        ├── account.repository.impl.ts
        └── ai-cache.repository.impl.ts

application/                      # Application Layer
└── actions/                      # Next.js Server Actions
    ├── transaction.actions.ts
    ├── category.actions.ts
    ├── insights.actions.ts
    ├── ai.actions.ts
    └── export.actions.ts

presentation/                     # Presentation Layer
├── components/
│   ├── ui/                      # shadcn/ui components (13 components)
│   └── features/                # Feature-specific components
│       ├── transactions/
│       │   └── transaction-item.tsx
│       ├── categories/
│       │   ├── category-card.tsx
│       │   └── category-selector.tsx
│       ├── home/
│       │   └── monthly-overview.tsx
│       ├── month/
│       │   └── month-detail-view.tsx
│       └── ai/
│           ├── ai-suggestion-card.tsx
│           ├── bulk-ai-suggestion.tsx
│           └── re-analyze-month.tsx
└── types/                       # Presentation layer types
    ├── transaction.ts
    └── index.ts
```

## 📚 docs/ Directory

```
docs/
├── ARCHITECTURE.md         # Architectuur documentatie
├── APP_README.md          # App gebruiksaanwijzing
├── CODE_QUALITY.md        # Code quality tools documentatie
├── DESIGN_SYSTEM.md       # Design system documentatie
├── DEVELOPMENT_ROADMAP.md # Development roadmap
├── PROJECT_STRUCTURE.md   # Dit bestand
├── archive/               # Oude feature documentatie
│   ├── AI_LEARNING.md
│   ├── AI_SETUP.md
│   ├── CONFIDENCE_THRESHOLD.md
│   ├── DATABASE_SETUP.md
│   ├── GEBRUIKSAANWIJZING.md
│   ├── HOMEPAGE_JAAR_INDELING.md
│   ├── INSIGHTS_FEATURE.md
│   ├── LAATSTE_WIJZIGING.md
│   ├── OPTIMIZATIONS.md
│   ├── QUICK_WINS_IMPLEMENTATIE.md
│   ├── RE_ANALYZE.md
│   ├── USER_CONTEXT.md
│   └── WIJZIGINGEN_INSIGHTS.md
└── csv-data/              # CSV import bestanden
```

## ✅ Migratie Status

### Fase 1: Foundation - VOLTOOID

- ✅ Clean Architecture setup
- ✅ Drizzle ORM integratie
- ✅ Repository pattern implementatie
- ✅ Database migratie naar SQLite

### Fase 2: UI Component Library - VOLTOOID

- ✅ shadcn/ui setup (13 components)
- ✅ Design system documentatie
- ✅ Legacy components gemigreerd naar `presentation/components/features/`

### Fase 3: Server Actions & Data Flow - VOLTOOID

- ✅ Use cases geïmplementeerd (6 use cases)
- ✅ Server Actions gemaakt (5 action files)
- ✅ API routes vervangen door Server Actions
- ✅ Server Components geoptimaliseerd
- ✅ Legacy code cleanup (`lib/`, `types/` folders opgeruimd)

### Fase 4.5: Code Quality Tools - VOLTOOID

- ✅ ESLint configuratie uitgebreid
- ✅ Prettier setup
- ✅ Husky pre-commit hooks
- ✅ lint-staged configuratie

## 📝 Naming Conventions

### Files

- **Entities**: `*.entity.ts` (bijv. `transaction.entity.ts`)
- **Use Cases**: `*.use-case.ts` (bijv. `get-transactions.use-case.ts`)
- **Repositories**: `*.repository.ts` (interface) of `*.repository.impl.ts` (implementatie)
- **Services**: `*.service.ts` (bijv. `openai.service.ts`)
- **Actions**: `*.actions.ts` (bijv. `transactions.actions.ts`)
- **Validators**: `*.validator.ts` (bijv. `transaction.validator.ts`)
- **Components**: `kebab-case.tsx` (bijv. `transaction-list.tsx`)

### Folders

- **kebab-case** voor alle folders (bijv. `use-cases`, `ai-cache`)

## 🚀 Beschikbare Scripts

Zie `package.json` voor alle beschikbare scripts:

### Development

- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run start` - Start production server

### Database

- `npm run migrate` - Database migratie
- `npm run db:generate` - Genereer Drizzle migrations
- `npm run db:push` - Push schema naar database
- `npm run db:studio` - Drizzle Studio (database GUI)
- `npm run import` - Import CSV files

### Code Quality

- `npm run lint` - Check linting errors
- `npm run lint:fix` - Fix linting errors automatisch
- `npm run format` - Format alle bestanden
- `npm run format:check` - Check formatting

### Testing (nog te implementeren)

- `npm run test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate coverage report

## 📊 Database

- **Location**: `data/transactions.db`
- **ORM**: Drizzle
- **Driver**: better-sqlite3 (synchronous)
- **Schema**: `infrastructure/database/drizzle/schema.ts`
- **Migrations**: `infrastructure/database/drizzle/migrations/`

### Database Tabellen

- `accounts` - Bank rekeningen
- `categories` - Uitgaven categorieën
- `subcategories` - Subcategorieën
- `transactions` - Financiële transacties
- `ai_suggestions_cache` - AI categorisatie cache
- `budgets` - Budget tracking (toekomstige feature)
