# Gezinsuitgaven App

Een professionele Next.js applicatie voor het beheren en categoriseren van gezinsuitgaven, gebouwd met Clean Architecture principes.

## 🚀 Features

- 📊 **Maandoverzicht**: Bekijk transacties per maand, gegroepeerd per categorie
- ✏️ **Bewerken**: Wijzig de categorie en subcategorie van transacties
- 🤖 **AI Suggesties**: Laat AI transacties automatisch categoriseren (individueel of bulk)
- 📈 **Totaal Overzicht**: Zie statistieken en uitgaven per categorie over de hele periode
- 💡 **Inzichten**: Vergelijk maanden, detecteer uitschieters, zie top categorieën
- 💾 **Persistent Storage**: SQLite database met Drizzle ORM
- ⚡ **Performance**: Caching, prefiltering, en geoptimaliseerde queries

## 🏗️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (100% type safe)
- **Database**: SQLite met Drizzle ORM
- **Validation**: Zod
- **UI**: Tailwind CSS + shadcn/ui (in progress)
- **AI**: OpenAI API
- **Architecture**: Clean Architecture

## 📁 Project Structuur

```
.
├── app/                    # Next.js App Router
├── application/            # Application layer (server actions, DTOs)
├── components/             # React components (legacy, wordt gemigreerd)
├── core/                   # Domain layer (entities, use cases, repositories)
├── infrastructure/         # Infrastructure (database, AI, cache)
├── presentation/           # Presentation layer (UI components, hooks)
├── lib/                    # Shared utilities & legacy code
├── scripts/                # Database scripts (import, migrate)
├── data/                   # SQLite database
├── docs/                   # Documentatie
│   ├── ARCHITECTURE.md    # Architectuur documentatie
│   ├── APP_README.md      # Oude app README
│   ├── archive/           # Oude feature documentatie
│   └── csv-data/          # CSV import bestanden
└── types/                 # TypeScript type definitions
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm of yarn

### Installation

```bash
# Install dependencies
npm install

# Setup environment variables
cp .env.local.example .env.local
# Add your OpenAI API key to .env.local
```

### Database Setup

De database is al gemigreerd naar het nieuwe Drizzle schema. Als je opnieuw wilt migreren:

```bash
npm run migrate
```

### Development

```bash
# Start development server
npm run dev

# Open http://localhost:3000
```

### Database Management

```bash
# Generate Drizzle migrations
npm run db:generate

# Push schema to database
npm run db:push

# Open Drizzle Studio (database GUI)
npm run db:studio
```

### Import CSV Data

```bash
npm run import
```

## 📚 Documentatie

- **[Architecture](docs/ARCHITECTURE.md)**: Volledige architectuur documentatie
- **[App README](docs/APP_README.md)**: Oude app documentatie
- **[Archive](docs/archive/)**: Oude feature documentatie

## 🏛️ Architecture

Deze applicatie volgt **Clean Architecture** principes:

- **Core Layer**: Domain entities, use cases, repository interfaces
- **Infrastructure Layer**: Database, AI services, cache implementations
- **Application Layer**: Server actions, DTOs, orchestration
- **Presentation Layer**: UI components, hooks

Zie [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) voor details.

## 🧪 Testing

(Coming in Phase 4)

```bash
npm run test
npm run test:e2e
```

## 📦 Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run migrate      # Migrate database to new schema
npm run import       # Import CSV files
npm run db:generate  # Generate Drizzle migrations
npm run db:push      # Push schema to database
npm run db:studio    # Open Drizzle Studio
```

## 🔐 Environment Variables

```env
OPENAI_API_KEY=your_openai_api_key_here
```

## 🚧 Roadmap

### Phase 1: Foundation ✅

- [x] Clean Architecture setup
- [x] Drizzle ORM integration
- [x] Repository pattern
- [x] Zod validation
- [x] Database migration

### Phase 2: UI Component Library (In Progress)

- [ ] shadcn/ui setup
- [ ] Design system
- [ ] Reusable components

### Phase 3: Server Actions & Data Flow

- [ ] Use cases implementation
- [ ] Server actions
- [ ] Replace API routes
- [ ] Server components

### Phase 4: Testing & Quality

- [ ] Testing framework
- [ ] Unit tests
- [ ] Integration tests
- [ ] E2E tests

### Phase 5: Performance & DevOps

- [ ] Performance optimizations
- [ ] CI/CD pipeline
- [ ] Monitoring

## 📄 License

Private project

## 👨‍💻 Author

Built with ❤️ for better financial management
