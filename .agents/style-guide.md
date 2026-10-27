# Mervida Design System

> This is the binding design system for the Mervida storefront and admin dashboard. It is not a style preference document — it is a constraint. Every UI change, in every surface (public site and `/admin`), must conform to what's written here. If a screen doesn't match this doc, that's a bug to fix, not a precedent to extend.

---

## 0. Why this doc exists

This file replaces an earlier, looser style guide. That version documented *intentions* ("less is more with weight") without a closed set of allowed values, which let five different font weights, two conflicting radius conventions, and accidental dark panels creep into a light-themed app over time — none of it caught, because nothing was actually enforced. This version defines **closed scales**: a fixed list of weights, a fixed type scale, a fixed radius scale. If a value isn't on the list, it doesn't belong in the app.

---

## 1. Typeface

**Plus Jakarta Sans is the only typeface in this app.** It is loaded once in `app/layout.tsx` and mapped to both `--font-sans` and `--font-display` in `app/globals.css`, so `font-sans` and `font-display` Tailwind classes resolve to the same face. There is no second typeface for body copy — no Inter, no system font fallback used intentionally. Do not add another `next/font` import.

---

## 2. Font weights — exactly three

| Weight | Tailwind class | Value | Use |
| --- | --- | --- | --- |
| Regular | `font-normal` | 400 | Body copy, descriptions, placeholder text, helper text, table cell content |
| Semibold | `font-semibold` | 600 | Labels, nav links, buttons, card titles (`h4`), emphasized inline text, table row primary text |
| Extrabold | `font-extrabold` | 800 | `h1`–`h3` only, hero numerics/stats, the single most important number on a screen |

**`font-medium`, `font-bold`, and `font-black` do not exist in this app.** If you're about to type one of those three classes, stop — pick `font-normal` or `font-semibold` instead. (`h1`–`h4` get their weight automatically from the base element styles in `globals.css`; don't add a weight class to a heading tag.)

Rules of thumb:
- Small uppercase tracked labels (captions, eyebrow-style meta) → `font-semibold`, never heavier.
- Body/description text → `font-normal`.
- A heading tag (`h1`–`h4`) needs no weight class — the tag itself carries the right weight.
- Never apply `font-extrabold` to anything smaller than ~14px. It's a headline weight, not a label weight.

---

## 3. Typography scale

Six levels. Every piece of text in the app maps to one of these.

| Level | Element / class | Size | Weight | Tracking | Line-height | Use |
| --- | --- | --- | --- | --- | --- | --- |
| H1 | `<h1>` | `clamp(2.25rem, 5vw, 3.5rem)` | 800 | -0.04em | 1.1 | Page hero title (one per page) |
| H2 | `<h2>` | `clamp(1.75rem, 4vw, 2.25rem)` | 800 | -0.03em | 1.15 | Major section heading |
| H3 | `<h3>` | 1.5rem | 800 | -0.02em | 1.25 | Subsection heading, modal/panel title |
| H4 | `<h4>` | 1.125rem | 600 | -0.01em | 1.3 | Card title, form-section title — the "workhorse" heading |
| Body | `text-sm` / `text-base` + `font-normal` | 14–16px | 400 | normal | 1.6–1.65 | Paragraphs, descriptions |
| Body Small | `text-xs` + `font-normal` | 12px | 400 | normal | 1.6 | Secondary/meta text that isn't a caption label |
| Caption | `.text-caption` utility | 11px | 600 | 0.2em | 1.4 | Uppercase labels, form field labels, table headers, button text, status pills |

`h1`–`h4` are styled globally in `app/globals.css` — just use the tag, don't re-style it with `font-display font-bold` classes (that pattern is gone from the codebase; if you see it, fix it). `.text-caption` is a utility class (also in `globals.css`) for the small uppercase label pattern used everywhere in admin forms — it replaces the old repeated `text-[10px] font-bold uppercase tracking-[0.3em]` incantation. Font sizes smaller than 11px that still need the caption treatment should use `.text-caption` plus an inline `style={{ fontSize: "9px" }}` (or `10px`/`8px`) rather than inventing a new text utility.

**No kicker/eyebrow labels above headings.** A heading carries its own weight — don't put a small uppercase tag above an `h1`/`h2` purely for decoration. (`.text-caption` is for functional labels — form fields, table headers, status badges — not for eyebrow text over a headline.)

---

## 4. Border radius scale

**No pill shapes.** `rounded-full` is never used for buttons, inputs, selects, badges, nav links, or status chips — every one of those uses `rounded-lg`, consistently, everywhere. This was a deliberate change away from the pill-shaped identity the app launched with; if you see a `rounded-full` button/input/badge in a diff, it's a regression, not a style choice to preserve.

| Token | Class | Value | Use |
| --- | --- | --- | --- |
| Standard | `rounded-lg` | 0.5rem | **The default for everything**: buttons, text inputs, selects, textareas-as-pills-used-to-be, badges, nav links, status chips, table-row controls — any UI control or label background |
| Tight | `rounded-xl` / `rounded-2xl` | 0.75rem / 1rem | Thumbnails, small inline chips nested inside a card |
| Card SM | `rounded-3xl` | 1.5rem | Compact cards, small tiles |
| Card MD | `rounded-4xl` | 2rem | Standard content cards |
| Card LG | `rounded-5xl` | 2.5rem | Section panels, admin form sections (the default "card" in `/admin`) |
| Card XL | `rounded-6xl` | 3rem | Large containers — the outer table/list wrapper on an index page |
| Circle | `rounded-full` | 9999px | **Only** for elements meant to be a true circle or an oblong track: icon-only buttons with equal width/height, avatar/thumbnail dots, status indicator dots, toggle-switch knobs. See exception below. |

`rounded-5xl` and `rounded-6xl` are **extended into Tailwind's default scale** via `--radius-5xl` / `--radius-6xl` in the `@theme` block of `app/globals.css` (Tailwind v4 only ships radius tokens up to `4xl` out of the box). Those two extra tokens exist specifically so these classes render real rounding instead of silently doing nothing — this was a live bug (32 occurrences of `rounded-5xl` rendering as square corners) before the tokens were added. Never reach for an arbitrary `rounded-[2.5rem]`/`rounded-[3rem]` bracket value again now that the named classes work; if you see one in a diff, replace it with the matching token above.

### The `rounded-full` exception

`rounded-full` still exists in the codebase, but only for genuine circles and circle-adjacent widgets — never as a "pill" radius choice for a rectangular control:

- Icon-only buttons where width equals height (`w-8 h-8`, `w-10 h-10`, etc.) — close buttons, avatar-style thumbnails, carousel dots.
- Small status/notification dots (`w-1.5 h-1.5`, `w-2 h-2`).
- Decorative blurred background orbs (`w-64 h-64 ... blur-3xl`).
- Toggle-switch **knobs** specifically (the small circular indicator that slides inside a track) — the knob is `rounded-full`, but the **track** it slides in uses `rounded-lg` like every other control, not `rounded-full`.

If the element's width and height aren't equal and it isn't a toggle track, it almost certainly shouldn't be `rounded-full` — that's the pill shape the app no longer uses.

---

## 5. Color palette

- **Primary dark**: `slate-900` (primary buttons, primary headings, dark-on-light text) — not `slate-950` for interactive surfaces; reserve `slate-950` for the darkest text tone only.
- **Primary accent**: `emerald-500` / `emerald-600` (hover states, active states, success, links, selected pills).
- **Text hierarchy**: `slate-950` → `slate-700` → `slate-500` → `slate-400` → `slate-300`, darkest to lightest.
- **Borders**: `slate-100` (default), `slate-200` (inputs).
- **Backgrounds**: `white` and `slate-50` only, alternating between sections for rhythm.
- **Status colors** (orders, stock levels — semantic, not decorative): `amber-500/600` for warning/low, `red-500/600` for error/depleted/destructive, `emerald-500/600` for good/success.

### No dark panels

**This is a light-themed application. A section background is never `slate-900` or `slate-950` unless it is covering a real background image or video.** This used to be a recurring bug — admin form sections ("Cover Image", "Product Images", "Manufacturing Video", "Visibility" toggles, the dashboard summary bar) were built with dark `bg-slate-900`/`bg-slate-950` panels and white text sitting inside an otherwise all-white app, for no reason tied to content. If you're about to write `bg-slate-900` or `bg-slate-950` on a `<section>`, `<div>`, or card, stop and ask: *is there an image or video filling this element?* If not, use `bg-white` with `border border-slate-100` (standard card) or `bg-slate-50` with `border border-slate-100/50` (muted/recessed card) instead.

The only legitimate dark surfaces in the app are: the public-site `Navbar`/`Footer` dark sections that are part of the committed marketing visual world (hero, footer), and anything with an actual photographic/video background underneath it.

---

## 6. Form inputs

`rounded-lg`, consistent across the whole app — no pill inputs:

```tsx
const inp =
  "w-full bg-white border border-slate-200 rounded-lg px-6 py-4 text-sm font-normal focus:outline-none focus:border-emerald-500 transition-all placeholder:text-slate-300";
```

Textareas and multi-line fields use the Card MD radius for a larger, softer box:

```tsx
const area =
  "w-full bg-white border border-slate-200 rounded-4xl px-6 py-5 text-sm font-normal focus:outline-none focus:border-emerald-500 transition-all placeholder:text-slate-300 resize-none";
```

Field labels always use `.text-caption text-slate-400`, with `ml-5` for the standard left offset:

```tsx
const lbl = "text-caption text-slate-400 block mb-2 ml-5";
```

---

## 7. Buttons

Two tiers, both `rounded-lg`, both `.text-caption` for the label:

```tsx
// Primary
className = "bg-slate-900 text-white rounded-lg py-3 px-8 hover:bg-emerald-600 active:scale-95 transition-all text-caption";

// Secondary / Ghost
className = "border border-slate-200 text-slate-700 rounded-lg py-3 px-8 hover:border-emerald-500 transition-all text-caption";
```

Primary CTA color is `slate-900`, not `slate-950` — `slate-950` is reserved for text, not large fill surfaces (it reads as pure black and fights the warmer slate-900 used everywhere else).

---

## 8. Icons

Icons are drawn SVGs (inline `<path>` data, `viewBox="0 0 24 24"`, one consistent stroke width per icon family — 1.5–1.75 for outline icons), never Unicode glyphs or emoji standing in for a real icon. The one exception is single-letter formatting shorthand in the rich text editor toolbar (`B`, `I`, `U`, `H1`/`H2`/`H3`, `P`) — those are literal abbreviations of the action, the same convention every word processor uses, not icon substitutes.

---

## 9. Layout & spacing

### Consistent horizontal padding

All public-site content sections use `px-6 sm:px-12`. The outer wrapper provides max-width only, never padding — each section handles its own.

### Admin form sections

Every admin form (`ProductForm`, `BlogForm`, Orders inline form, Categories inline form, Settings) is built from `<section>` blocks alternating `bg-slate-50`/`bg-white` with `border border-slate-100`, `rounded-5xl`, `p-8`, `space-y-6`. Each section opens with an `<h4>` title (no manual weight/size classes — the tag carries it) and groups related fields in a `grid md:grid-cols-2` or `md:grid-cols-3`.

### Logo sizing

Never use `fill` mode with a fixed-width container for logos — it creates dead space if the image aspect ratio doesn't fill the box. Use `width`/`height` with `h-10 w-auto object-contain` instead.

---

## 10. Admin dashboard (`/admin`)

The admin dashboard and all its sub-pages (`products`, `categories`, `orders`, `blog`, `settings`, `personal-shopping`) follow everything above with no exceptions. Specific conventions:

- `AdminSidebar` nav items each carry a real outline SVG icon (24×24, strokeWidth 1.75) next to the label — not text-only, so the current section is identifiable at a glance.
- Table headers use `.text-caption text-slate-400`.
- Table primary cell text (customer name, product name, category name) uses `text-sm font-semibold text-slate-900` — body text in a table row is never `font-normal` for the primary identifying column, since that's the scan anchor.
- Status badges (order status, stock status) are `.text-caption` inside a `rounded-lg border` chip using the semantic status colors from §5.
- Auth is a 6-digit PIN only (`ADMIN_PIN` env var) — there is no email/password admin login anywhere in this app. Don't reintroduce one.

---

## 11. Anti-patterns to avoid

1. **Any of `font-medium`, `font-bold`, `font-black`.** There are three weights. Using a fourth is the single most common way this doc gets violated.
2. **A dark (`slate-900`/`950`) section background with no image/video under it.** See §5.
3. **Arbitrary bracket radius values** (`rounded-[2.5rem]`, `rounded-[3rem]`, etc.) — use the named scale in §4; it covers every case already in use in this codebase.
3a. **`rounded-full` on a button, input, select, badge, or nav link.** That's the pill shape the app explicitly moved away from — those use `rounded-lg`. `rounded-full` is reserved for true circles (see §4's exception).
4. **A second typeface.** Plus Jakarta Sans only.
5. **Unicode glyphs or emoji as icons** (🔗, 🖼, •, ✓ used as a bullet/checkmark icon) — draw an SVG icon instead.
6. **A kicker/eyebrow label above a heading** purely for decoration.
7. **Fixed-width image containers with `fill`** — respect natural aspect ratio with `w-auto` + fixed height.
8. **Missing horizontal padding** on a public-site content section — every section needs `px-6 sm:px-12`.
9. **Inconsistent action wording for the same action** — e.g. a form's top-of-page save button and its bottom-of-page save button using different words ("Synchronize Settings" vs. "Commit Changes") for the identical action. Pick one verb per action and use it everywhere that action appears.
10. **Corporate-jargon copy for plain concepts** — "Unified ledger of omni-channel WhatsApp transactions" when "Orders placed through WhatsApp and recorded manually" says the same thing and is instantly scannable. Admin copy is written for someone glancing at it while doing a task, not read for style.

---

## 12. Cross-platform links (distribution)

The distribution platform (`distribute.mervida.com`) is a separate project. Links from this storefront use `target="_blank"` with `rel="noopener noreferrer"`, an external-link icon (drawn SVG, per §8), and neutral copy — not targeting specific buyer types, since the platform serves everyone (consumers, retailers, businesses).

---

## 13. What "done" looks like

Before calling any UI change finished, check it against this doc specifically:
- Does every weight class read `font-normal`, `font-semibold`, or `font-extrabold`? (Or no class at all, on a heading tag.)
- Does every heading use a real `h1`–`h4` tag rather than a styled `div`/`p`?
- Is every radius value one of `rounded-lg` / `rounded-xl` / `rounded-2xl` / `rounded-3xl` / `rounded-4xl` / `rounded-5xl` / `rounded-6xl` — nothing bracketed? Is `rounded-full` used only on true circles/toggle knobs, never on a button, input, or badge?
- Is there a dark background anywhere that isn't sitting under an image or video?
- Would someone glancing at this for two seconds know what it's showing and what to do next?

If any answer is no, it's not done.
