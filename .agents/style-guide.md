# Mervida UI Style Guide

> Living document of design decisions, typography rules, and UI principles for the Mervida storefront. Updated as design evolves. The goal is to produce UI that feels **human-designed**, not AI-generated.

---

## Core Philosophy

- **Less is more with font weight.** When everything is bold, nothing stands out. Reserve strong weights for true hierarchy anchors.
- **Uppercase + tracking already adds visual weight.** Small uppercase labels with letter-spacing don't need `font-bold` or `font-black` — `font-semibold` or even `font-medium` is usually enough.
- **De-emphasize to emphasize.** The way to make important elements shine is to quiet down the surrounding elements, not to make everything loud.
- **No placeholder images.** Generate real images rather than using grey boxes or stock placeholders.

---

## Typography Weight Hierarchy

Use font weights deliberately for hierarchy. This is the established scale:

| Weight             | Class           | Usage                                                                                                                         |
| ------------------ | --------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| **Black (900)**    | `font-black`    | Hero `<h1>` headings only (e.g. "The Collection.", main landing hero). Reserved for the single most important text on a page. |
| **Bold (700)**     | `font-bold`     | Section `<h2>` headings, card titles, primary CTAs, footer section labels. The "workhorse" heading weight.                    |
| **Semibold (600)** | `font-semibold` | Nav links, dropdown items, footer links, form labels, secondary buttons, small uppercase section tags.                        |
| **Medium (500)**   | `font-medium`   | Body/description text, card descriptions, testimonial quotes, helper text, copyright lines. The default for readable prose.   |
| **Normal (400)**   | `font-normal`   | Rarely used — most text uses at least `font-medium` for the slightly refined feel.                                            |

### Rules of Thumb

1. **Small uppercase tracked labels** (e.g. `text-[10px] uppercase tracking-[0.4em]`) → use `font-semibold` max, never `font-black`
2. **Navigation links** → `font-semibold` (the pill container and uppercase tracking provide enough emphasis)
3. **Footer links** → `font-semibold` (they're secondary navigation)
4. **Copyright / legal text** → `font-medium` (completely de-emphasized)
5. **Card body text** → `font-medium` (readable, not screaming)
6. **Form field labels** → `font-semibold` at small sizes, or `font-bold` only if the label is the primary identifier
7. **CTA buttons** → `font-bold` or `font-semibold` (the button itself provides emphasis through color/shape)
8. **Price text** → `font-bold` on the number, `font-medium` on the unit/suffix

---

## Layout & Spacing

### Consistent Horizontal Padding

All content sections must have horizontal padding to prevent content from touching the viewport edges:

```
px-6 sm:px-12
```

This applies to:

- Page headers and breadcrumbs
- Product grids
- Content sections
- Form containers

The outer `<main>` or `max-w-[1440px]` wrapper doesn't provide padding — each section handles its own.

### Logo Sizing

Never use `fill` mode with a fixed-width container for logos — it creates dead space if the image aspect ratio doesn't fill the box. Instead:

```tsx
// ✅ Correct — shrink-wraps to natural width
<Image
  src="/images/mervida-logo.png"
  alt="Mervida Logo"
  width={128}
  height={40}
  className="h-10 w-auto object-contain"
/>

// ❌ Wrong — fixed 128px box with dead space
<div className="relative w-32 h-10">
  <Image src="..." fill className="object-contain" />
</div>
```

### Dark Hero Sections

Pages with dark hero backgrounds need to be registered in the Navbar's `isDarkPath` check so the navbar text starts white and transitions to dark on scroll:

```ts
const isDarkPath =
  pathname === "/" ||
  [
    "/bulk-orders",
    "/contact",
    "/faq",
    "/privacy",
    "/terms",
    "/personal-shopping",
  ].some((p) => pathname.startsWith(p));
```

---

## Color Palette

- **Primary dark**: `slate-950` (backgrounds, headings, CTAs)
- **Primary accent**: `emerald-500` / `emerald-600` (highlights, active states, labels)
- **Text hierarchy**: `slate-950` → `slate-700` → `slate-500` → `slate-400` → `slate-300`
- **Borders**: `slate-100` (light), `white/10` (dark backgrounds)
- **Backgrounds**: `white`, `slate-50` (alternating sections)
- **Hover accent**: `emerald-600` or `emerald-700`

### Dark Section Pattern

Dark sections (hero, FAQ, CTA banners) use:

- Background: `slate-950` or `bg-pattern-dark`
- Text: `white`, `white/70`, `white/50`, `white/40`
- Accent labels: `emerald-400` or `emerald-500/60`
- Borders: `white/10`, `white/5`
- Background decorative text: `text-white/[0.02]` or `text-white/[0.03]`

---

## Component Patterns

### Section Labels (Eyebrow Text)

Small uppercase text above section headings:

```tsx
<p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-emerald-600 mb-4">
  Section Label
</p>
```

### Card Style

Rounded containers with subtle borders:

```tsx
className = "bg-slate-50 border border-slate-100 rounded-[2.5rem] p-10";
// or for slightly smaller cards:
className = "bg-white border border-slate-100 rounded-[2rem] p-8";
```

### Buttons

Two tiers:

```tsx
// Primary CTA
className =
  "bg-slate-950 hover:bg-emerald-600 text-white py-4 rounded-full font-semibold text-[11px] uppercase tracking-widest transition-all active:scale-95";

// Secondary / Ghost
className =
  "border border-slate-200 text-slate-700 py-4 rounded-full font-semibold text-[11px] uppercase tracking-widest hover:border-emerald-500 transition-all";
```

### Form Inputs

Consistent rounded style:

```tsx
className =
  "w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-2xl px-6 py-3.5 text-sm outline-none transition-all placeholder:text-slate-300";
```

---

## Navbar

- Uses a contained pill-style nav bar: `rounded-full border bg-slate-50`
- Links: `font-semibold` (not bold), uppercase, wide tracking
- Dropdowns: smooth scale/opacity animation on hover with 300ms delay for mouse leave
- Logo: `h-10 w-auto` with `shrink-0` on the link wrapper
- Scrolled state: white background with backdrop blur
- Dark pages: white text mode until scroll

---

## Footer

- Dark background (`slate-950`)
- Section titles: `font-bold` (not `font-black`), `text-[10px]`, uppercase, wide tracking, `text-emerald-500/50`
- Links: `font-semibold`, `text-[13px]`, `text-slate-500 hover:text-white`
- Bottom bar: `font-medium` for copyright, `font-semibold` for legal links
- Background decorative text: `font-black` is fine here since it's a purely decorative watermark

---

## Cross-Platform Links (Distribution)

The distribution platform (`distribute.mervida.com`) is a separate project. Links from this storefront use:

- `target="_blank"` with `rel="noopener noreferrer"`
- External link icon (arrow-top-right-square SVG)
- Neutral, inclusive copy — not targeting specific buyer types since the platform serves everyone (consumers, retailers, businesses)

---

## Anti-Patterns to Avoid

1. **Everything bold** — The #1 tell of AI-generated UI. If body text, labels, links, and headings are all `font-bold` or higher, the hierarchy collapses.
2. **`font-black` on small text** — Weight 900 is for large hero text only. On small text it looks heavy and unnatural.
3. **Fixed-width image containers** — Use `w-auto` with a fixed height so images respect their natural aspect ratio.
4. **Missing horizontal padding** — Every content section needs `px-6 sm:px-12`. The outer wrapper provides max-width, not padding.
5. **`float` or `absolute` for layout** — Use flexbox (`flex`, `justify-between`, `items-center`) for all layout positioning.
6. **Placeholder content** — Generate real images and use real-sounding copy. No "Lorem ipsum" or grey boxes.
