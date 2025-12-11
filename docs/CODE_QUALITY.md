# Code Quality Tools

Deze documentatie beschrijft de code quality tools die in dit project zijn geconfigureerd.

## 🛠️ Tools

### ESLint

ESLint is geconfigureerd voor TypeScript en Next.js met de volgende features:

- TypeScript-specific rules
- React/Next.js best practices
- Unused variable detection
- Console statement warnings
- Prettier integration

**Configuratie:** `eslint.config.mjs`

### Prettier

Prettier zorgt voor consistente code formatting:

- Single quotes voor strings
- Semicolons aan het einde van statements
- 100 karakters per regel
- 2 spaties voor indentatie
- Trailing commas in ES5 stijl

**Configuratie:** `.prettierrc`

### Husky

Husky zorgt voor Git hooks die automatisch code quality checks uitvoeren:

- Pre-commit hook: Voert lint-staged uit
- Voorkomt dat slechte code wordt gecommit

**Configuratie:** `.husky/pre-commit`

### lint-staged

lint-staged voert linting en formatting uit op staged files:

- ESLint fix op TypeScript bestanden
- Prettier formatting op alle ondersteunde bestanden

**Configuratie:** `package.json` → `lint-staged`

## 📝 Beschikbare Scripts

### Linting

```bash
# Check code voor linting errors
npm run lint

# Fix linting errors automatisch
npm run lint:fix
```

### Formatting

```bash
# Check code formatting
npm run format:check

# Format alle bestanden
npm run format
```

### Pre-commit

Pre-commit hooks worden automatisch uitgevoerd bij `git commit`. Je kunt ze ook handmatig uitvoeren:

```bash
npx lint-staged
```

## 🚀 Workflow

### Tijdens Development

1. Schrijf code zoals normaal
2. Voer `npm run lint:fix` uit om linting errors te fixen
3. Voer `npm run format` uit om code te formatteren
4. Commit je changes - pre-commit hook voert automatisch checks uit

### Voor Pull Requests

1. Zorg dat `npm run lint` geen errors geeft
2. Zorg dat `npm run format:check` slaagt
3. Alle tests moeten slagen (`npm test`)

## ⚙️ Configuratie Aanpassen

### ESLint Rules

Pas `eslint.config.mjs` aan om rules toe te voegen of te wijzigen:

```javascript
rules: {
  "@typescript-eslint/no-unused-vars": "warn",
  "no-console": ["warn", { allow: ["warn", "error"] }],
  // Voeg hier je eigen rules toe
}
```

### Prettier Options

Pas `.prettierrc` aan om formatting opties te wijzigen:

```json
{
  "semi": true,
  "singleQuote": true,
  "printWidth": 100
}
```

### lint-staged

Pas `package.json` → `lint-staged` aan om verschillende checks uit te voeren:

```json
"lint-staged": {
  "*.{ts,tsx}": [
    "eslint --fix",
    "prettier --write"
  ]
}
```

## 🔍 Veelvoorkomende Issues

### ESLint Errors

**Unused variables:**

```typescript
// ❌ Fout
const unusedVar = 'test';

// ✅ Goed - prefix met underscore
const _unusedVar = 'test';
```

**Console statements:**

```typescript
// ❌ Fout
console.log('debug');

// ✅ Goed
console.warn('warning');
console.error('error');
```

**Any type:**

```typescript
// ❌ Fout
const data: any = {};

// ✅ Goed
const data: Record<string, unknown> = {};
```

### Prettier Formatting

Als Prettier en ESLint conflicteren, heeft Prettier voorrang. De `eslint-config-prettier` plugin schakelt conflicterende ESLint rules uit.

### Pre-commit Hook Fails

Als de pre-commit hook faalt:

1. Fix de linting errors: `npm run lint:fix`
2. Format de code: `npm run format`
3. Probeer opnieuw te committen

Je kunt de hook tijdelijk overslaan met:

```bash
git commit --no-verify
```

**Let op:** Gebruik dit alleen in noodgevallen!

## 📊 Code Quality Metrics

### Huidige Status

- ESLint: Geconfigureerd met TypeScript en React rules
- Prettier: Geconfigureerd met project standards
- Husky: Pre-commit hooks actief
- lint-staged: Automatische formatting en linting

### Toekomstige Verbeteringen

- [ ] SonarQube integratie
- [ ] Code coverage thresholds
- [ ] Complexity metrics
- [ ] Dependency vulnerability scanning
