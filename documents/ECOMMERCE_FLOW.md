# Mini Ecommerce Flow Spec

## Food Processing / Manufacturing Business

### Checkout → WhatsApp (No Payment Gateway)

---

## GLOBAL ELEMENTS (Present on every page)

### Navbar

- **Logo** (left) — links to `/`
- **Nav links** (center/right):
  - Products → `/products`
  - Categories → dropdown listing all categories (each links to `/products?category=slug`)
  - About → `/about`
  - Contact → `/contact`
  - Bulk Orders → `/bulk-orders`
- **Cart Icon** (right) — shows item count badge, opens Cart Drawer on click
- **Mobile**: Hamburger menu collapses nav links; cart icon stays visible

### Cart Drawer (Slide-in panel, not a page)

- Triggered by clicking cart icon anywhere on the site
- Lists all added items: product image thumbnail, name, quantity controls (+ / −), unit price, line total
- Remove item button (×) per item
- Order subtotal (sum of line totals)
- **Disclaimer text**: "Prices shown are estimates. Final price confirmed on WhatsApp."
- **"Order via WhatsApp" CTA button** (prominent, green)
  - On click: constructs a pre-filled WhatsApp message (see WhatsApp Message Format section) and opens `https://wa.me/{BUSINESS_PHONE}?text={encoded_message}` in a new tab
- "Continue Shopping" link closes the drawer
- Empty state: illustration + "Your cart is empty" + "Browse Products" button

### Footer

- Logo + one-line business tagline
- Quick links: Products, About, Contact, Bulk Orders, FAQ
- Contact info: phone number, email, address
- Social media icons (Instagram, Facebook, WhatsApp)
- "© 2025 [Business Name]. All rights reserved."
- Links: Privacy Policy (`/privacy`), Terms of Use (`/terms`)

---

## WHATSAPP MESSAGE FORMAT

When the user clicks "Order via WhatsApp", build this message dynamically:

```
Hello [Business Name]! 👋

I'd like to place an order:

🛒 *My Order:*
• [Product Name 1] × [Qty] — ₦[line total]
• [Product Name 2] × [Qty] — ₦[line total]
• [Product Name 3] × [Qty] — ₦[line total]

💰 *Estimated Total: ₦[subtotal]*

Please confirm availability, final pricing, and delivery options. Thank you!
```

- Each product line uses its exact product name as stored in the data
- Currency symbol and formatting match the business locale
- Message is URL-encoded before appending to the WhatsApp link

---

## PAGE 1: Landing Page `/`

**Purpose**: First impression. Communicate brand identity, show product range, build trust, drive to browse or buy.

### Section 1 — Hero

- Full-width banner (image or video background of the manufacturing/product)
- **Headline**: Bold statement about the brand (e.g., "Wholesome. Crafted. Delivered.")
- **Subheadline**: One sentence describing what the business makes and sells
- **Two CTAs**:
  - Primary: "Shop Now" → `/products`
  - Secondary: "Our Story" → `/about`

### Section 2 — Category Strip

- Horizontal scrollable row of category cards
- Each card: category image/icon, category name
- On click → `/products?category=slug`
- Example categories for a food processing business: Grains & Cereals, Oils & Fats, Canned & Preserved, Spices & Seasonings, Snacks, Beverages, Dairy Alternatives, Sauces & Pastes

### Section 3 — Featured Products

- Section heading: "Featured Products"
- 4–6 product cards in a responsive grid (2 cols mobile, 3–4 cols desktop)
- Each card (see Product Card spec below)
- "View All Products" button → `/products`

### Section 4 — Why Choose Us (Trust Bar)

- 3–4 icon + text blocks in a row:
  - ✅ NAFDAC Certified (or relevant certification)
  - 🏭 Factory-Direct Pricing
  - 🚚 Nationwide Delivery
  - 💬 Order via WhatsApp — Easy & Fast
- Clean, minimal design. No CTAs needed here.

### Section 5 — About Snippet

- Left: a compelling image (team, factory, product line)
- Right: 2–3 short paragraphs about the business origin and mission
- CTA: "Read Our Full Story" → `/about`

### Section 6 — Bestsellers / New Arrivals (Tabs)

- Toggle tabs: "Bestsellers" | "New Arrivals"
- Each tab shows 4 product cards
- Switching tabs swaps the product grid (no page reload)

### Section 7 — Bulk Order CTA Banner

- Full-width colored banner
- Headline: "Need Large Quantities?"
- Subtext: "We supply to retailers, distributors, and caterers. Get a custom quote."
- CTA: "Request Bulk Quote" → `/bulk-orders`

### Section 8 — Testimonials / Social Proof

- 3 customer/client quotes in a card carousel or static grid
- Each: quote text, customer name, business (if B2B), optional star rating

### Section 9 — Instagram Feed Strip (Optional)

- 6 latest Instagram photos in a grid
- Caption: "Follow us @[handle]"
- Each image links to the Instagram post

---

## PAGE 2: Products Listing Page `/products`

**Purpose**: Browse all products. Filter and search to find specific items.

### Filters Sidebar (desktop) / Filter Drawer (mobile)

- **Category** — checkbox list of all categories (multi-select)
- **Price Range** — min/max slider or input fields
- **Sort By** — dropdown: Featured, Price: Low to High, Price: High to Low, Newest, Bestsellers
- "Clear All Filters" link
- Active filter count badge on mobile filter button

### Page Header

- Breadcrumb: Home > Products
- Page title: "All Products" (or "Results for [category]" when filtered)
- Product count: "Showing 24 of 56 products"

### Search Bar

- Inline search above the grid
- Real-time filter as user types (client-side search on product name and description)
- Clear (×) button inside the input

### Product Grid

- Responsive: 1 col (mobile) → 2 col (tablet) → 3–4 col (desktop)
- Each item is a **Product Card** (see spec below)
- Infinite scroll or "Load More" button (prefer Load More for simplicity)
- Empty state if no results: "No products found. Try adjusting your filters."

### Product Card (Reusable component used across site)

- Product image (square crop, lazy loaded)
- **Badge** (optional): "New", "Bestseller", "Out of Stock" — overlaid top-left
- Product name (links to `/products/[name-slug]`)
- Short description (1 line, truncated)
- Price (e.g., ₦1,500 / 500g) — show unit/weight clearly
- **"Add to Cart" button**
  - If in stock: adds to cart, shows brief success feedback (button text → "Added ✓" for 1.5s)
  - If out of stock: button is disabled, label reads "Out of Stock"
- Quantity selector (optional on card, always available on product detail page)

---

## PAGE 3: Single Product Page `/products/[name-slug]`

**Purpose**: Full product detail. Convince user to add to cart.

### Breadcrumb

- Home > Products > [Category] > [Product Name]

### Product Detail Layout (2-column on desktop, stacked on mobile)

**Left Column — Images**

- Main image (large)
- Thumbnail row below (if multiple images — e.g., front, back, label close-up, product in use)
- Click thumbnail → swaps main image
- Optional: zoom on hover (desktop)

**Right Column — Info**

- Product name (H1)
- **Badge**: Bestseller / New / Out of Stock (if applicable)
- Price — large, prominent. Format: ₦X,XXX per [unit/weight]
- Short description (2–3 sentences)
- **Variant Selector** (if applicable): e.g., size options — 250g / 500g / 1kg — as pill buttons. Selecting a variant updates the price.
- **Quantity Selector**: − [number] + (min: 1, max: stock quantity or reasonable cap like 50)
- **"Add to Cart" button** — large, full-width on mobile
- **"Order on WhatsApp" button** (secondary) — for users who want to skip cart and message directly. Pre-fills a single-product message.
- **Stock status**: "In Stock" (green) / "Low Stock — Only X left" (amber) / "Out of Stock" (red)
- **Delivery note**: e.g., "Delivery available nationwide. Confirm at checkout."
- Share icons: WhatsApp, copy link

### Tabs Section (below main detail)

- **Tab 1: Description** — Full product description (ingredients, use cases, storage instructions)
- **Tab 2: Nutrition / Specs** — Table of nutritional info or technical specs (weight, dimensions, certifications like NAFDAC number, SON, Halal, etc.)
- **Tab 3: Shipping & Returns** — Delivery policy, lead time, return conditions

### Related Products

- Heading: "You Might Also Like"
- 4 product cards from the same category
- Horizontal scroll on mobile

---

## PAGE 4: About Page `/about`

**Purpose**: Build brand trust and communicate company values.

### Section 1 — Hero / Banner

- Large image or video (factory, team, raw materials)
- Headline: "Who We Are"
- One powerful sentence about the company

### Section 2 — Our Story

- Timeline or narrative format
- Founding year, key milestones, growth story
- 2–3 paragraphs with an accompanying image

### Section 3 — Mission & Values

- 3–4 value cards (icon + title + short text):
  - Quality First
  - Locally Sourced Ingredients
  - Ethical Manufacturing
  - Community Impact

### Section 4 — The Process (How We Make Our Products)

- Step-by-step visual (numbered cards or horizontal timeline):
  1. Sourcing raw materials
  2. Quality inspection
  3. Processing & manufacturing
  4. Packaging & labeling
  5. Quality control & certification
  6. Distribution
- Optional: photos or icons per step

### Section 5 — Certifications & Compliance

- Logos or badges: NAFDAC, SON, ISO (if any), Halal, etc.
- Short explanation of what each certification means for product safety

### Section 6 — Team (Optional)

- Founder/key team member cards: photo, name, role, 1-line bio

### Section 7 — CTA

- "Ready to try our products?" + "Shop Now" button → `/products`

---

## PAGE 5: Contact Page `/contact`

**Purpose**: Make it easy to reach the business.

### Layout — Two columns (stacked on mobile)

**Left: Contact Info**

- Business address (with embedded Google Maps iframe)
- Phone number (click to call)
- Email address (click to email)
- WhatsApp button: "Chat with us on WhatsApp" → direct WhatsApp link
- Business hours: Mon–Sat, 8am–6pm

**Right: Contact Form**

- Fields:
  - Full Name (required)
  - Email Address (required)
  - Phone Number (optional)
  - Subject — dropdown: General Inquiry / Product Question / Bulk Order / Complaint / Partnership
  - Message (required, textarea)
- "Send Message" button
- On submit: show success message "We'll get back to you within 24 hours."
- Note: Form can submit to a free service like Formspree, EmailJS, or similar — no backend needed

### Social Links

- Instagram, Facebook, WhatsApp icons with handles/links

---

## PAGE 6: Bulk Orders Page `/bulk-orders`

**Purpose**: Capture B2B leads — retailers, distributors, caterers, institutions.

### Section 1 — Hero

- Headline: "Supplying Businesses Across Nigeria"
- Subtext: "We offer competitive wholesale pricing for bulk purchases."
- List of who this is for: Supermarkets, Restaurants, Caterers, Schools, Distributors, Exporters

### Section 2 — Benefits

- 3–4 cards:
  - Factory-direct pricing
  - Custom packaging available
  - Consistent supply guarantee
  - Dedicated account manager

### Section 3 — Minimum Order Info

- Table or card list showing minimum order quantities per product category
- Note on lead times

### Section 4 — Bulk Quote Form

- Fields:
  - Business Name (required)
  - Contact Person (required)
  - Phone Number (required)
  - Email Address (required)
  - Products Interested In (multi-select checkboxes or text area)
  - Estimated Monthly Quantity
  - Message / Additional Notes
- "Submit Enquiry" button
- On submit: success confirmation + "We'll contact you within 48 hours with a custom quote."

### Section 5 — WhatsApp Shortcut

- "Prefer to talk directly?"
- "Message us on WhatsApp for bulk enquiries" → WhatsApp link with pre-filled message: "Hello, I'm interested in placing a bulk order. Please send me your wholesale price list."

---

## PAGE 7: FAQ Page `/faq`

**Purpose**: Reduce support load by answering common questions.

### Layout

- Accordion (expand/collapse) grouped by category

**Category: Ordering**

- How do I place an order?
- Can I change or cancel my order after sending a WhatsApp message?
- Do I need to create an account?
- What happens after I send my order on WhatsApp?

**Category: Products**

- Are your products NAFDAC certified?
- Where are your ingredients sourced?
- Do you offer product samples?
- What is the shelf life of your products?

**Category: Delivery**

- Which states do you deliver to?
- How long does delivery take?
- How much does delivery cost?
- Can I pick up my order?

**Category: Payments**

- What payment methods do you accept?
- When do I pay — before or after delivery?
- Do you offer payment on delivery?

**Category: Bulk & Wholesale**

- What is the minimum order for bulk pricing?
- Can you do custom packaging for my brand?

### Bottom CTA

- "Still have questions?" → Contact us at [email] or [WhatsApp button]

---

## PAGE 8: Privacy Policy `/privacy`

**Purpose**: Legal compliance, user trust.

### Content Sections

1. Introduction — what data is collected and why
2. Information We Collect — form submissions, cookies, analytics
3. How We Use Your Information — responding to enquiries, order processing, marketing (if opted in)
4. Data Storage — where data is stored, how long it's kept
5. Third-Party Services — WhatsApp, Google Analytics, Formspree, etc.
6. Your Rights — right to request deletion, opt out of marketing
7. Cookies Policy — what cookies the site uses
8. Contact — who to contact for privacy concerns
9. Last Updated date

---

## PAGE 9: Terms of Use `/terms`

**Purpose**: Legal protection for the business.

### Content Sections

1. Acceptance of Terms
2. Use of the Website
3. Product Information — prices and availability subject to change
4. Order Process — placing an order via WhatsApp constitutes intent to purchase, not a binding contract until confirmed by the business
5. Pricing — all prices are estimates; final price confirmed before payment
6. Intellectual Property — all content belongs to the business
7. Limitation of Liability
8. Changes to Terms
9. Governing Law — Nigerian law
10. Contact Information

---

## PAGE 10: 404 Not Found Page

**Purpose**: Graceful error handling; keep users on the site.

### Content

- Friendly illustration or on-brand graphic
- Headline: "Oops! Page Not Found."
- Subtext: "The page you're looking for doesn't exist or may have moved."
- Two buttons:
  - "Go Back Home" → `/`
  - "Browse Products" → `/products`

---

## SITE-WIDE ROUTING SUMMARY

| Route                     | Page                              |
| ------------------------- | --------------------------------- |
| `/`                       | Landing Page                      |
| `/products`               | All Products (with filter/search) |
| `/products?category=slug` | Products filtered by category     |
| `/products/[name-slug]`   | Single Product Detail             |
| `/about`                  | About Us                          |
| `/contact`                | Contact                           |
| `/bulk-orders`            | Bulk Orders / Wholesale           |
| `/faq`                    | FAQ                               |
| `/privacy`                | Privacy Policy                    |
| `/terms`                  | Terms of Use                      |
| `*` (catch-all)           | 404 Page                          |

---

## DATA MODELS

### Product

```
{
  id: string (unique),
  nameSlug: string (unique, URL-safe, e.g. "tomato-paste-500g"),
  name: string (display name, e.g. "Tomato Paste 500g"),
  category: string (category slug),
  images: string[] (array of image URLs, first = primary),
  shortDescription: string (1–2 sentences),
  fullDescription: string (HTML or markdown),
  price: number (base price),
  unit: string (e.g. "500g", "1 litre", "pack of 12"),
  variants: [{ label: string, price: number }] | null,
  nutritionSpecs: { [key: string]: string } | null,
  certifications: string[] (e.g. ["NAFDAC", "Halal"]),
  nafdacNumber: string | null,
  inStock: boolean,
  stockCount: number | null,
  isFeatured: boolean,
  isBestseller: boolean,
  isNew: boolean,
  createdAt: date
}
```

### Category

```
{
  slug: string (unique, URL-safe),
  name: string,
  description: string,
  image: string (URL)
}
```

### Cart Item (client-side state only — no backend)

```
{
  productId: string,
  productName: string,
  nameSlug: string,
  image: string,
  price: number,
  unit: string,
  variantLabel: string | null,
  quantity: number
}
```

---

## CART & WHATSAPP CHECKOUT FLOW (Step by Step)

1. User lands on any page
2. User browses products (via listing page or landing page)
3. User opens a product detail page
4. User selects variant (if any) and sets quantity
5. User clicks **"Add to Cart"**
   - Cart item is added to client-side cart state (localStorage or React state)
   - Cart icon badge increments
   - Brief visual confirmation ("Added ✓")
6. User continues browsing or clicks the cart icon
7. Cart Drawer slides open — shows all items, quantities, subtotal
8. User adjusts quantities or removes items as needed
9. User clicks **"Order via WhatsApp"**
10. JavaScript builds the pre-filled WhatsApp message (see format above)
11. Browser opens `https://wa.me/[number]?text=[encoded_message]` in a new tab
12. WhatsApp opens (web or app) with the message pre-filled
13. User sends the message
14. Business receives the message and replies to confirm stock, final price, delivery cost, and payment details
15. User pays via the business's preferred payment method (bank transfer, POS, etc.) — handled entirely off-platform

---

## KEY IMPLEMENTATION NOTES FOR THE AI AGENT

- **No authentication required** — this is a catalogue + WhatsApp funnel, not a full ecommerce platform
- **Cart state**: Use `localStorage` to persist cart across page refreshes. Key: `cart_items`. Value: JSON array of cart items.
- **Product data**: Can be a static JSON file (`/data/products.json`) or fetched from a headless CMS (Sanity, Contentful, Notion API). The agent should scaffold for static JSON first.
- **WhatsApp number**: Store in a single config file/env variable `WHATSAPP_NUMBER` in international format without `+` or spaces (e.g., `2348012345678`)
- **URL slugs**: Product `nameSlug` must be unique. Derive from product name: lowercase, spaces → hyphens, remove special characters.
- **Images**: Use a CDN or image hosting (Cloudinary, Supabase Storage). Always include alt text.
- **SEO**: Each product page needs a unique `<title>` and `<meta description>` using product name and description.
- **Analytics**: Add Google Analytics or Plausible to track which products are most viewed and most "add to cart" clicked.
- **No payment gateway** — do not integrate Paystack, Stripe, Flutterwave, etc. All payments are confirmed and collected via WhatsApp conversation.
