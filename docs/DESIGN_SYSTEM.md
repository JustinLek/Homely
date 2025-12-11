# 🎨 Design System - Gezinsuitgaven App

## Overzicht

Dit document beschrijft het design system van de Gezinsuitgaven app, gebaseerd op shadcn/ui met Tailwind CSS.

## Kleuren

### Primaire Kleuren

- **Primary**: Slate 900 - Gebruikt voor hoofdacties en belangrijke elementen
- **Secondary**: Slate 100 - Gebruikt voor secundaire acties
- **Accent**: Slate 100 - Gebruikt voor highlights en focus states

### Semantische Kleuren

- **Destructive**: Red 500 - Gebruikt voor delete acties en errors
- **Muted**: Slate 100 - Gebruikt voor disabled states en subtiele backgrounds
- **Border**: Slate 200 - Gebruikt voor borders en dividers

### Chart Kleuren

- **Chart 1**: Orange - Primaire chart kleur
- **Chart 2**: Teal - Secundaire chart kleur
- **Chart 3**: Blue - Tertiaire chart kleur
- **Chart 4**: Yellow - Quaternaire chart kleur
- **Chart 5**: Red - Quinaire chart kleur

### Categorieën Kleuren

```typescript
// Specifieke kleuren per categorie type
const categoryColors = {
  groceries: 'bg-green-100 text-green-800',
  transport: 'bg-blue-100 text-blue-800',
  utilities: 'bg-yellow-100 text-yellow-800',
  entertainment: 'bg-purple-100 text-purple-800',
  healthcare: 'bg-red-100 text-red-800',
  other: 'bg-gray-100 text-gray-800',
};
```

## Typography

### Headings

- **H1**: `text-4xl font-bold` - Pagina titels
- **H2**: `text-3xl font-semibold` - Sectie titels
- **H3**: `text-2xl font-semibold` - Subsectie titels
- **H4**: `text-xl font-medium` - Card titels

### Body Text

- **Large**: `text-lg` - Belangrijke body text
- **Base**: `text-base` - Standaard body text
- **Small**: `text-sm` - Secundaire informatie
- **XSmall**: `text-xs` - Labels en hints

### Font Weights

- **Bold**: `font-bold` (700)
- **Semibold**: `font-semibold` (600)
- **Medium**: `font-medium` (500)
- **Normal**: `font-normal` (400)

## Spacing

### Margins & Padding

- **xs**: `0.25rem` (4px)
- **sm**: `0.5rem` (8px)
- **md**: `1rem` (16px)
- **lg**: `1.5rem` (24px)
- **xl**: `2rem` (32px)
- **2xl**: `3rem` (48px)

### Container Widths

- **sm**: `640px`
- **md**: `768px`
- **lg**: `1024px`
- **xl**: `1280px`
- **2xl**: `1400px`

## Border Radius

- **sm**: `calc(var(--radius) - 4px)` - Kleine elementen
- **md**: `calc(var(--radius) - 2px)` - Medium elementen
- **lg**: `var(--radius)` - Grote elementen (default: 0.5rem)

## Icons

### Icon Library

We gebruiken **Lucide React** voor alle icons.

### Veelgebruikte Icons

```typescript
import {
  Euro, // Bedragen
  Calendar, // Datums
  Tag, // Categorieën
  TrendingUp, // Stijgende trends
  TrendingDown, // Dalende trends
  AlertCircle, // Waarschuwingen
  CheckCircle, // Success
  XCircle, // Errors
  Info, // Informatie
  Settings, // Instellingen
  Download, // Export
  Upload, // Import
  Sparkles, // AI features
} from 'lucide-react';
```

### Icon Sizes

- **xs**: `w-3 h-3` (12px)
- **sm**: `w-4 h-4` (16px)
- **md**: `w-5 h-5` (20px)
- **lg**: `w-6 h-6` (24px)
- **xl**: `w-8 h-8` (32px)

## Components

### Button Variants

- **default**: Primaire actie (filled, primary color)
- **secondary**: Secundaire actie (outlined)
- **destructive**: Delete/remove acties (red)
- **outline**: Tertiary acties
- **ghost**: Minimale acties
- **link**: Link-style buttons

### Button Sizes

- **sm**: Klein (padding: 0.5rem 1rem)
- **default**: Standaard (padding: 0.75rem 1.5rem)
- **lg**: Groot (padding: 1rem 2rem)
- **icon**: Icon-only (square)

### Card Variants

- **default**: Standaard card met border
- **elevated**: Card met shadow
- **outlined**: Card met dikke border

### Badge Variants

- **default**: Standaard badge
- **secondary**: Secundaire badge
- **destructive**: Error/warning badge
- **outline**: Outlined badge

## Responsive Design

### Breakpoints

```typescript
// Tailwind breakpoints
sm: '640px',   // Mobile landscape
md: '768px',   // Tablet
lg: '1024px',  // Desktop
xl: '1280px',  // Large desktop
2xl: '1400px', // Extra large desktop
```

### Mobile-First Approach

Alle componenten zijn mobile-first ontworpen en schalen op naar grotere schermen.

## Accessibility

### Focus States

Alle interactieve elementen hebben duidelijke focus states met `ring-2 ring-offset-2`.

### Color Contrast

Alle tekst heeft minimaal WCAG AA contrast ratio (4.5:1 voor normale tekst, 3:1 voor grote tekst).

### Keyboard Navigation

Alle componenten zijn volledig keyboard-accessible.

## Usage Examples

### Typography Component

```tsx
<h1 className="text-4xl font-bold">Gezinsuitgaven</h1>
<p className="text-base text-muted-foreground">Overzicht van je uitgaven</p>
```

### Button Component

```tsx
<Button variant="default" size="md">
  Opslaan
</Button>
```

### Card Component

```tsx
<Card>
  <CardHeader>
    <CardTitle>Maandoverzicht</CardTitle>
  </CardHeader>
  <CardContent>{/* Content */}</CardContent>
</Card>
```
