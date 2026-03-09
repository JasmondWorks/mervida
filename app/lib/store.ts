import type { Product, Category, Order, AdminSettings } from "./types";

export const AVAILABLE_IMAGES = [
  "/images/Gemini_Generated_Image_57wk9u57wk9u57wk.png",
  "/images/Gemini_Generated_Image_d5nhlud5nhlud5nh.png",
  "/images/Gemini_Generated_Image_fo41nwfo41nwfo41.png",
  "/images/Gemini_Generated_Image_gjtc7hgjtc7hgjtc.png",
  "/images/Gemini_Generated_Image_jzb35ajzb35ajzb3.png",
  "/images/Gemini_Generated_Image_kpfum5kpfum5kpfu.png",
  "/images/Gemini_Generated_Image_n4osk1n4osk1n4os.png",
  "/images/Gemini_Generated_Image_nj83i1nj83i1nj83.png",
  "/images/Gemini_Generated_Image_pzci9tpzci9tpzci.png",
  "/images/Gemini_Generated_Image_qricg8qricg8qric.png",
  "/images/Gemini_Generated_Image_ro3hkoro3hkoro3h.png",
  "/images/Gemini_Generated_Image_tgtjaetgtjaetgtj.png",
  "/images/Gemini_Generated_Image_z345wjz345wjz345.png",
];

const KEYS = {
  products: "gfo_products",
  categories: "gfo_categories",
  orders: "gfo_orders",
  settings: "gfo_settings",
};

const NOW = "2026-01-01T00:00:00.000Z";

const DEFAULT_CATEGORIES: Category[] = [
  {
    id: "cat-1",
    name: "Flours",
    slug: "flours",
    description: "Natural grain and legume flours",
    createdAt: NOW,
  },
  {
    id: "cat-2",
    name: "Sweeteners",
    slug: "sweeteners",
    description: "Natural sweeteners and syrups",
    createdAt: NOW,
  },
  {
    id: "cat-3",
    name: "Spices & Seasonings",
    slug: "spices-seasonings",
    description: "Natural spices and seasoning blends",
    createdAt: NOW,
  },
  {
    id: "cat-4",
    name: "Salts",
    slug: "salts",
    description: "Premium natural salts",
    createdAt: NOW,
  },
];

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    name: "Plantain Flour",
    slug: "plantain-flour-1kg",
    shortDescription:
      "Premium sun-dried plantain flour, naturally gluten-free and rich in nutrients.",
    fullDescription:
      "Our Plantain Flour is made from carefully selected, sun-dried plantains. It is 100% natural, gluten-free, and perfect for baking, thickening soups, and making traditional Nigerian dishes. No preservatives, no additives — just pure plantain goodness.",
    images: [
      "/images/Gemini_Generated_Image_57wk9u57wk9u57wk.png",
      "/images/Gemini_Generated_Image_pzci9tpzci9tpzci.png",
      "/images/Gemini_Generated_Image_jzb35ajzb35ajzb3.png",
    ],
    price: 2500,
    unit: "1kg",
    categoryId: "cat-1",
    variants: [],
    nutritionSpecs: {
      Calories: "350 kcal per 100g",
      Carbohydrates: "88g per 100g",
      Protein: "2g per 100g",
      Fat: "0.5g per 100g",
    },
    stockCount: 45,
    inStock: true,
    nafdacNumber: "",
    certifications: ["Gluten-Free"],
    isFeatured: true,
    isBestseller: true,
    isNew: false,
    seoTitle: "Plantain Flour 1kg – Mervida by GFO Foods",
    seoDescription:
      "Buy premium sun-dried plantain flour from Mervida. Naturally gluten-free, no preservatives.",
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: "prod-2",
    name: "Bean Flour",
    slug: "bean-flour-1kg",
    shortDescription:
      "Protein-rich bean flour, stone-milled for the finest texture.",
    fullDescription:
      "Our Bean Flour is made from clean, stone-milled beans. High in protein and fiber, it is ideal for making moi moi, akara, and other bean-based dishes without the mess of peeling.",
    images: [],
    price: 2800,
    unit: "1kg",
    categoryId: "cat-1",
    variants: [],
    nutritionSpecs: {
      Calories: "340 kcal per 100g",
      Protein: "22g per 100g",
      Fiber: "15g per 100g",
    },
    stockCount: 30,
    inStock: true,
    nafdacNumber: "",
    certifications: [],
    isFeatured: false,
    isBestseller: true,
    isNew: false,
    seoTitle: "Bean Flour 1kg – Mervida by GFO Foods",
    seoDescription:
      "Premium protein-rich bean flour for moi moi and akara. Naturally stone-milled.",
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: "prod-3",
    name: "Date Syrup",
    slug: "date-syrup-500ml",
    shortDescription:
      "Pure cold-extracted date syrup — nature's finest sweetener.",
    fullDescription:
      "Our Date Syrup is cold-extracted from premium Medjool dates. It is a 100% natural sweetener with no added sugar, perfect as a honey substitute, for baking, smoothies, and desserts.",
    images: ["/images/Gemini_Generated_Image_d5nhlud5nhlud5nh.png"],
    price: 3500,
    unit: "500ml",
    categoryId: "cat-2",
    variants: [],
    nutritionSpecs: {
      Calories: "282 kcal per 100ml",
      Sugar: "66g per 100ml (natural)",
      Iron: "0.9mg per 100ml",
    },
    stockCount: 20,
    inStock: true,
    nafdacNumber: "",
    certifications: ["100% Natural", "No Added Sugar"],
    isFeatured: true,
    isBestseller: false,
    isNew: true,
    seoTitle: "Date Syrup 500ml – Mervida by GFO Foods",
    seoDescription:
      "Cold-extracted pure date syrup from premium Medjool dates. Natural sweetener, no added sugar.",
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: "prod-4",
    name: "Multipurpose Spice",
    slug: "multipurpose-spice-100g",
    shortDescription:
      "A bold, all-natural spice blend for every Nigerian kitchen.",
    fullDescription:
      "Our Multipurpose Spice is a carefully crafted blend of natural herbs and spices. No artificial flavours, no MSG. Just pure, bold flavour for soups, stews, rice, and proteins.",
    images: [],
    price: 1200,
    unit: "100g",
    categoryId: "cat-3",
    variants: [],
    nutritionSpecs: {},
    stockCount: 8,
    inStock: true,
    nafdacNumber: "",
    certifications: ["No MSG", "No Artificial Flavours"],
    isFeatured: false,
    isBestseller: false,
    isNew: true,
    seoTitle: "Multipurpose Spice 100g – Mervida by GFO Foods",
    seoDescription:
      "Bold all-natural spice blend for Nigerian cooking. No MSG, no artificial flavours.",
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: "prod-5",
    name: "Sea Salt",
    slug: "sea-salt-750g",
    shortDescription: "Unrefined, mineral-rich sea salt — pure and natural.",
    fullDescription:
      "Our Sea Salt is unrefined and naturally harvested from pristine Atlantic waters. It retains its full mineral profile — no bleaching, no anti-caking agents. The clean, pure taste that elevates every dish.",
    images: ["/images/Gemini_Generated_Image_nj83i1nj83i1nj83.png"],
    price: 900,
    unit: "750g",
    categoryId: "cat-4",
    variants: [],
    nutritionSpecs: {
      Sodium: "38.7g per 100g",
      Magnesium: "92mg per 100g",
    },
    stockCount: 0,
    inStock: false,
    nafdacNumber: "",
    certifications: ["Unrefined", "Pure and Natural"],
    isFeatured: false,
    isBestseller: false,
    isNew: false,
    seoTitle: "Sea Salt 750g – Mervida by GFO Foods",
    seoDescription:
      "Unrefined Atlantic sea salt. Mineral-rich, naturally harvested, no additives.",
    createdAt: NOW,
    updatedAt: NOW,
  },
];

const DEFAULT_SETTINGS: AdminSettings = {
  whatsappNumber: "",
  whatsappMessageTemplate:
    "Hello GFO Foods! 👋\n\nI'd like to place an order:\n\n🛒 *My Order:*\n{items}\n\n💰 *Estimated Total: ₦{total}*\n\nPlease confirm availability, final pricing, and delivery options. Thank you!",
  adminPassword: "admin123",
  businessName: "GFO Foods Limited",
  businessEmail: "",
  carouselImages: [
    "/images/Gemini_Generated_Image_n4osk1n4osk1n4os.png",
    "/images/Gemini_Generated_Image_ro3hkoro3hkoro3h.png",
    "/images/Gemini_Generated_Image_kpfum5kpfum5kpfu.png",
    "/images/Gemini_Generated_Image_fo41nwfo41nwfo41.png",
    "/images/Gemini_Generated_Image_gjtc7hgjtc7hgjtc.png",
  ],
};

function read<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const data = localStorage.getItem(key);
    return data ? (JSON.parse(data) as T) : null;
  } catch {
    return null;
  }
}

function write<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

export function initStore(): void {
  if (typeof window === "undefined") return;
  if (!localStorage.getItem(KEYS.products))
    write(KEYS.products, DEFAULT_PRODUCTS);
  if (!localStorage.getItem(KEYS.categories))
    write(KEYS.categories, DEFAULT_CATEGORIES);
  if (!localStorage.getItem(KEYS.orders)) write(KEYS.orders, []);
  if (!localStorage.getItem(KEYS.settings))
    write(KEYS.settings, DEFAULT_SETTINGS);
}

// ── Products ──────────────────────────────────────────────────────────────────

export function getProducts(): Product[] {
  return read<Product[]>(KEYS.products) ?? [];
}

export function getProduct(id: string): Product | undefined {
  return getProducts().find((p) => p.id === id);
}

export function saveProduct(product: Product): void {
  const list = getProducts();
  const idx = list.findIndex((p) => p.id === product.id);
  if (idx >= 0) list[idx] = product;
  else list.unshift(product);
  write(KEYS.products, list);
}

export function deleteProduct(id: string): void {
  write(
    KEYS.products,
    getProducts().filter((p) => p.id !== id),
  );
}

export function isSlugUnique(slug: string, excludeId?: string): boolean {
  return !getProducts().some((p) => p.slug === slug && p.id !== excludeId);
}

// ── Categories ────────────────────────────────────────────────────────────────

export function getCategories(): Category[] {
  return read<Category[]>(KEYS.categories) ?? [];
}

export function saveCategory(category: Category): void {
  const list = getCategories();
  const idx = list.findIndex((c) => c.id === category.id);
  if (idx >= 0) list[idx] = category;
  else list.unshift(category);
  write(KEYS.categories, list);
}

export function deleteCategory(id: string): void {
  write(
    KEYS.categories,
    getCategories().filter((c) => c.id !== id),
  );
}

// ── Orders ────────────────────────────────────────────────────────────────────

export function getOrders(): Order[] {
  return read<Order[]>(KEYS.orders) ?? [];
}

export function saveOrder(order: Order): void {
  const list = getOrders();
  const idx = list.findIndex((o) => o.id === order.id);
  if (idx >= 0) list[idx] = order;
  else list.unshift(order);
  write(KEYS.orders, list);
}

export function deleteOrder(id: string): void {
  write(
    KEYS.orders,
    getOrders().filter((o) => o.id !== id),
  );
}

// ── Settings ──────────────────────────────────────────────────────────────────

export function getSettings(): AdminSettings {
  return read<AdminSettings>(KEYS.settings) ?? DEFAULT_SETTINGS;
}

export function saveSettings(settings: AdminSettings): void {
  write(KEYS.settings, settings);
}

// ── Auth ──────────────────────────────────────────────────────────────────────

export function login(password: string): boolean {
  const settings = getSettings();
  if (password === settings.adminPassword) {
    sessionStorage.setItem("gfo_admin_auth", "true");
    return true;
  }
  return false;
}

export function logout(): void {
  sessionStorage.removeItem("gfo_admin_auth");
}

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem("gfo_admin_auth") === "true";
}

// ── Utils ─────────────────────────────────────────────────────────────────────

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}
