# Mervida — Agent Instructions

Mervida (GFO Foods Limited) is a Next.js storefront + admin dashboard for a Lagos-based clean-label food brand. Postgres (Neon) via Prisma, Cloudinary for media, Upstash QStash for async deletion cleanup, a PIN-only admin auth (no email/password).

## Design system — read `.agents/style-guide.md` before touching any UI

That file is the binding design system for this app, not a suggestion. The rules below are the ones violated most often; the full detail, rationale, and scale tables live in `.agents/style-guide.md`.

- **One typeface.** Plus Jakarta Sans, everywhere. No second font.
- **Three font weights only.** `font-normal` (400), `font-semibold` (600), `font-extrabold` (800). Never `font-medium`, `font-bold`, or `font-black`.
- **Headings are real `h1`–`h4` tags**, unstyled beyond the tag — their weight/size comes from base styles in `app/globals.css`, not a manual className.
- **No pill shapes.** Buttons, inputs, selects, badges, nav links all use `rounded-lg`. `rounded-full` exists only for true circles (icon buttons with equal width/height, dots, toggle knobs) — never for a button, input, or badge.
- **Every input, select, and button is exactly `h-12`.** No `py-3`/`py-4`/`py-5` approximations. A field and the button beside it must align pixel-for-pixel.
- **Use the UI primitives (`app/components/ui/`): `Button`, `Field` (including `type="password"` with a built-in reveal toggle), `Modal`, `ConfirmDialog`, `Toggle`, `Badge`, `Tabs`, `Card`, `EmptyState`, `Skeleton`, `Spinner`, and the Typography set (`H1`–`H4`, `Text`, `Caption`, `Label`).** Never hand-write a `<button>`/`<input>`/`<select>`/`<h1>`/`<p>` with raw classNames — these primitives already wrap `app/lib/ui-classnames.ts` and the correct height/radius/weight. That classnames file is the *style* layer; the components are the *behavior* layer — import the components, don't duplicate either. A local one-off is fine only when a primitive genuinely doesn't fit the layout (see style-guide §14).
- **Use `Table` (`app/components/table/`) for every list/grid of records.** Not a hand-written `<table>`. Columns, row actions, selection, loading skeleton, empty state, and pagination are all built in — see style-guide §14 for the full API. Categories, Orders, Products, Blog, and Personal Shopping's two lists are the reference implementations.
- **Never use `window.confirm()` / `alert()`.** Use `ConfirmDialog` for destructive confirmations — it's styled, shows a loading state during the request, and doesn't block the main thread.
- **Modal vs. dedicated page vs. inline section** — short bounded create/edit/confirm tasks are a `Modal`; large multi-section forms with uploads (ProductForm, BlogForm) and recurring-visit configuration (Settings) stay dedicated pages; a detail view meant to be read alongside list context (Personal Shopping's request detail) stays an inline swap. Full doctrine and the reasoning behind each existing choice: style-guide §15.
- **No dark (`slate-900`/`950`) section background unless it's actually covering an image or video.** This was a recurring bug in `/admin` forms — ask before adding one.
- **Radius scale**: `rounded-lg` (controls) → `rounded-3xl`/`4xl`/`5xl`/`6xl` (cards, smallest to largest). Never an arbitrary `rounded-[Nrem]` bracket value — the named scale covers every case already in use.
- Icons are drawn SVGs, never emoji/Unicode glyphs standing in for an icon.

Before calling any UI change done, re-read `.agents/style-guide.md` §13 ("What done looks like") and check the diff against it.

## Other conventions

- Admin auth is PIN-only (`ADMIN_PIN` env var, signed session cookie via `middleware.ts`). Don't reintroduce email/password.
- WhatsApp integration number comes from `WHATSAPP_NUMBER` env var, with a DB override in Settings — `/api/settings` falls back to the env var when the DB value is empty.
- Cloudinary uploads are organized by folder per asset type (`app/lib/upload-folders.ts`); deletions remove the DB reference instantly and queue the actual Cloudinary deletion via QStash (`app/api/jobs/delete-cloudinary-asset`) so the UI never blocks on it.
- Blog post bodies are HTML from the TipTap rich-text editor (`app/components/admin/RichTextEditor.tsx`), sanitized server-side via `app/lib/sanitize-html.ts` before being stored — never render unsanitized HTML, and never reintroduce Markdown for blog content (it was deliberately replaced with a WYSIWYG editor since the content author isn't technical).
