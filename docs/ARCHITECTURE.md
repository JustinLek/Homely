# Architecture Documentation

## Overview

Deze applicatie volgt **Clean Architecture** principes met een duidelijke scheiding tussen layers.

## Folder Structuur

```
Gezinsuitgaven/
├── core/                    # Domain Layer (Business Logic)
│   ├── constants/          # App constants (CATEGORIES, MONTHS)
│   ├── entities/           # Domain models
│   ├── use-cases/          # Business use cases
│   ├── repositories/       # Repository interfaces
│   ├── validators/         # Zod schemas
│   └── lib/                # Core utilities (utils, errors, constants)
│
├── infrastructure/         # Infrastructure Layer
│   └── database/
│       ├── drizzle/       # Drizzle ORM schema & client
│       └── repositories/  # Repository implementations
│
├── application/           # Application Layer
│   └── actions/          # Next.js Server Actions
│
├── presentation/         # Presentation Layer
│   ├── components/
│   │   ├── ui/          # shadcn/ui components
│   │   └── features/    # Feature-specific components
│   └── types/           # Presentation layer types
│
└── app/                 # Next.js App Router
    ├── page.tsx         # Homepage
    ├── overzicht/       # Overview page
    ├── maand/[month]/   # Month detail pages
    └── loading.tsx      # Loading states
```

## Layers

### 1. Core Layer (Domain)

- **Entities**: Pure domain models met business logic
- **Use Cases**: Business logic en workflows
- **Repositories**: Interfaces voor data access (geen implementatie!)

**Regels:**

- Geen dependencies op andere layers
- Geen framework-specifieke code
- Pure TypeScript/JavaScript

### 2. Infrastructure Layer

- **Database**: Drizzle ORM schema en repository implementaties
- **AI**: OpenAI service implementaties
- **Cache**: Caching mechanismen

**Regels:**

- Implementeert interfaces uit Core layer
- Mag dependencies hebben op externe libraries (Drizzle, OpenAI, etc.)

### 3. Application Layer

- **Server Actions**: Next.js server actions voor data mutations
- **DTOs**: Data transfer objects voor API boundaries

**Regels:**

- Orkestreert use cases
- Valideert input met Zod
- Handelt errors af

### 4. Presentation Layer

- **Components**: React components (UI + Features)
- **Hooks**: Custom React hooks

**Regels:**

- Alleen UI logic
- Roept Server Actions aan
- Geen directe database access

## Data Flow

```
User Interaction
    ↓
Presentation Component
    ↓
Server Action (Application Layer)
    ↓
Use Case (Core Layer)
    ↓
Repository Interface (Core Layer)
    ↓
Repository Implementation (Infrastructure Layer)
    ↓
Database (Drizzle ORM)
```

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **ORM**: Drizzle ORM
- **Database**: SQLite (better-sqlite3)
- **Validation**: Zod
- **UI**: shadcn/ui + Tailwind CSS
- **AI**: OpenAI API

## Key Principles

1. **Dependency Rule**: Dependencies point inward (Core heeft geen dependencies)
2. **Single Responsibility**: Elke class/module heeft één verantwoordelijkheid
3. **Interface Segregation**: Kleine, specifieke interfaces
4. **Dependency Injection**: Repositories worden geïnjecteerd in use cases
5. **Type Safety**: 100% TypeScript met strikte types

## Database Schema

Zie `infrastructure/database/drizzle/schema.ts` voor het volledige schema.

### Belangrijkste tabellen

- `accounts`: Bank accounts
- `categories`: Expense categories
- `subcategories`: Detailed subcategories
- `transactions`: Financial transactions
- `ai_suggestions_cache`: AI categorization cache
- `budgets`: Budget tracking (future feature)

## Scripts

```bash
# Development
npm run dev

# Database
npm run migrate          # Migreer oude data naar nieuwe schema
npm run db:generate      # Genereer Drizzle migrations
npm run db:push          # Push schema naar database
npm run db:studio        # Open Drizzle Studio (GUI)

# Import
npm run import           # Importeer CSV bestanden
```

## Testing Strategy

(Nog te implementeren in Fase 4)

- **Unit Tests**: Use cases en entities
- **Integration Tests**: Repositories en database
- **E2E Tests**: Complete user flows

## Error Handling

Alle errors worden afgehandeld via custom error classes in `core/lib/errors.ts`:

- `ValidationError`: Input validatie fouten
- `NotFoundError`: Resource niet gevonden
- `DatabaseError`: Database operatie fouten

## Best Practices

1. **Gebruik altijd Zod voor validatie** van input
2. **Gebruik Server Actions** voor data mutations (geen API routes)
3. **Gebruik Server Components** waar mogelijk voor data fetching
4. **Gebruik Repository pattern** voor database access
5. **Gebruik Use Cases** voor business logic
6. **Gebruik Entities** voor domain models met methods
7. **Gebruik DTOs** voor data transfer tussen layers

## Migration Guide

Zie `scripts/migrate-to-drizzle.ts` voor de migratie van oude naar nieuwe schema.

## Future Enhancements

- Multi-user support met authentication
- Budget tracking & alerts
- Recurring transactions detection
- Bank API integratie (PSD2)
- Mobile app (React Native)
