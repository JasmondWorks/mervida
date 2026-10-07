import type { Product, Category, Order, AdminSettings } from "./types";

export const AVAILABLE_IMAGES = [
  "/images/garri.jpeg",
  "/images/palm-oil.jpeg",
  "/images/plantain-flower.jpeg",
  "/images/coconut-oil.jpg",
  "/images/carrot-oil.jpg",
  "/images/spices.jpg",
];

const KEYS = {
  products: "gfo_products",
  categories: "gfo_categories",
  orders: "gfo_orders",
  settings: "gfo_settings",
};

const NOW = "2026-01-01T00:00:00.000Z";

const STORE_VERSION_KEY = "gfo_store_version";
const CURRENT_VERSION = "v11_fix_plantain_flour_category_and_spice_image";

const DEFAULT_CATEGORIES: Category[] = [
  {
    id: "cat-african-foods",
    name: "African Foods",
    slug: "african-foods",
    description: "Everyday African staples, rich traditional red oil, and authentic herb seasonings",
    createdAt: NOW,
  },
  {
    id: "cat-baking-ingredients",
    name: "Baking Ingredients",
    slug: "baking-ingredients",
    description: "Pure cold-pressed cooking oils, gluten-free flours, and natural baking fats",
    createdAt: NOW,
  },
  {
    id: "cat-food-chemicals",
    name: "Natural Food Colorants",
    slug: "food-chemicals",
    description: "Natural plant color oils, pure carrot extracts, and clean food-making additives",
    createdAt: NOW,
  },
];

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: "prod-garri",
    name: "Ijebu Yellow Garri",
    slug: "ijebu-yellow-garri",
    shortDescription:
      "Crisp, pleasantly sour, and 100% sand-free. Roasted clean from fresh cassava.",
    fullDescription:
      "Forget garri that leaves sand at the bottom of your cup. Our Ijebu Yellow Garri is made from fresh cassava, fermented properly, and pan-roasted in clean stainless-steel setups. Sifted three times for a smooth, sand-free crunch—perfect for drinking cold or making light, smooth eba.",
    images: ["/images/garri.jpeg"],
    price: 3200,
    unit: "1kg",
    categoryId: "cat-african-foods",
    variants: [],
    nutritionSpecs: {
      Carbohydrates: "84g per 100g",
      DietaryFiber: "3.5g per 100g",
      Calories: "360 kcal per 100g",
    },
    stockCount: 50,
    inStock: true,
    nafdacNumber: "08-7241",
    certifications: ["100% Natural", "Sand-Free", "NAFDAC Registered"],
    isFeatured: true,
    isBestseller: true,
    isNew: false,
    processVideo: {
      title: "How We Ferment & Pan-Roast Our Sand-Free Garri",
      videoUrl: "/videos/garri-manufacturing.mp4",
      posterUrl: "/images/garri.jpeg",
      duration: "1:10",
      categoryName: "African Foods",
      highlights: [
        "Clean Stainless Pan Roasting",
        "Sifted 3 Times for Zero Sand",
        "Sealed for Freshness",
      ],
    },
    seoTitle: "Ijebu Yellow Garri 1kg – Mervida by GFO Foods",
    seoDescription:
      "Buy crisp, clean Ijebu Yellow Garri. 100% sand-free, naturally fermented.",
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: "prod-palm-oil",
    name: "Unrefined Red Palm Oil",
    slug: "unrefined-red-palm-oil",
    shortDescription:
      "Pure, rich red palm oil that smells like home. No fake color, no chemicals.",
    fullDescription:
      "Pure red palm oil pressed directly from fresh oil palm fruits with zero heat bleaching or chemical additives. Packed with natural Vitamin E and rich color to give your stews that deep, authentic taste and mouthwatering aroma.",
    images: ["/images/palm-oil.jpeg"],
    price: 4500,
    unit: "1L",
    categoryId: "cat-african-foods",
    variants: [],
    nutritionSpecs: {
      NaturalColor: "Rich Red Palm Pigment",
      VitaminE: "15mg per 100g",
      NaturalFats: "100% Pure Plant Oil",
    },
    stockCount: 40,
    inStock: true,
    nafdacNumber: "08-8319",
    certifications: ["100% Unrefined", "No Chemicals", "Export Sealed"],
    isFeatured: true,
    isBestseller: true,
    isNew: false,
    processVideo: {
      title: "Pressing Fresh Palm Fruit & Settling Clean Oil",
      videoUrl: "/videos/palm-oil-manufacturing.mp4",
      posterUrl: "/images/palm-oil.jpeg",
      duration: "0:55",
      categoryName: "African Foods",
      highlights: [
        "No Chemical Bleach",
        "Natural Rich Red Color",
        "Tamper-Evident Sealed Bottle",
      ],
    },
    seoTitle: "Unrefined Red Palm Oil 1L – Mervida by GFO Foods",
    seoDescription:
      "Pure unrefined red palm oil. Naturally rich in Vitamin E, zero chemical bleaching.",
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: "prod-spices",
    name: "African Multipurpose Spice Blend",
    slug: "african-multipurpose-spice-blend",
    shortDescription:
      "Whole ground herbs and peppers. 0% MSG, 0% salt fillers, 100% real flavor.",
    fullDescription:
      "A rich blend of dried ginger, garlic, calabash nutmeg (ehuru), and local peppers. We grind real sun-dried herbs whole so you get maximum flavor without cheap salt fillers or artificial MSG.",
    images: ["/images/spices.jpg"],
    price: 1800,
    unit: "150g",
    categoryId: "cat-african-foods",
    variants: [],
    nutritionSpecs: {
      Sodium: "Zero Added Salt",
      Fillers: "0% Artificial Additives",
    },
    stockCount: 65,
    inStock: true,
    nafdacNumber: "08-9102",
    certifications: ["No MSG", "100% Whole Herb Ground", "Freshness Sealed Jar"],
    isFeatured: true,
    isBestseller: false,
    isNew: true,
    processVideo: {
      title: "Sun-Drying & Grinding Our Herb Seasoning",
      videoUrl: "/videos/spices-manufacturing.mp4",
      posterUrl: "/images/spices.jpg",
      duration: "0:45",
      categoryName: "African Foods",
      highlights: [
        "Real Ground Herbs",
        "Zero MSG or Fake Salt",
        "Freshness Sealed Jar",
      ],
    },
    seoTitle: "African Multipurpose Spice Blend – Mervida by GFO Foods",
    seoDescription:
      "All-natural African spice blend with zero MSG or fillers. Real ground herbs.",
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: "prod-plantain-flour",
    name: "Sun-Dried Plantain Flour",
    slug: "sun-dried-plantain-flour",
    shortDescription:
      "Gluten-free flour milled from 100% green unripe plantains. Easy on the stomach.",
    fullDescription:
      "Made from fresh green unripe plantains, sun-dried and ground into a smooth flour. Naturally gluten-free, light on digestion, and packed with fiber and potassium. Great for baking breads or preparing a healthy, comforting swallow.",
    images: ["/images/plantain-flower.jpeg"],
    price: 2800,
    unit: "1kg",
    categoryId: "cat-african-foods",
    variants: [],
    nutritionSpecs: {
      Calories: "350 kcal per 100g",
      Potassium: "499mg per 100g",
      Gluten: "0% (Gluten-Free)",
    },
    stockCount: 45,
    inStock: true,
    nafdacNumber: "08-5520",
    certifications: ["Gluten-Free", "High Fiber", "NAFDAC Registered"],
    isFeatured: true,
    isBestseller: true,
    isNew: false,
    processVideo: {
      title: "Drying & Milling Green Unripe Plantains",
      videoUrl: "/videos/plantain-flour-manufacturing.mp4",
      posterUrl: "/images/plantain-flower.jpeg",
      duration: "1:00",
      categoryName: "African Foods",
      highlights: [
        "100% Green Unripe Plantains",
        "No Artificial Additives",
        "Gluten-Free Clean Facility",
      ],
    },
    seoTitle: "Sun-Dried Plantain Flour 1kg – Mervida by GFO Foods",
    seoDescription:
      "Gluten-free plantain flour for healthy baking and smooth swallow recipes.",
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: "prod-coconut-oil",
    name: "Cold-Pressed Virgin Coconut Oil",
    slug: "cold-pressed-virgin-coconut-oil",
    shortDescription:
      "Raw cold-pressed coconut oil. Sweet fresh aroma, perfect for clean baking.",
    fullDescription:
      "Cold-extracted from fresh coconut meat with zero high heat or chemical bleaching. It retains its natural coconut aroma and clean fats—making it a wonderful butter replacement for baking pastries, frying, and daily cooking.",
    images: ["/images/coconut-oil.jpg"],
    price: 4800,
    unit: "500ml",
    categoryId: "cat-baking-ingredients",
    variants: [],
    nutritionSpecs: {
      GoodFats: "50% Lauric Acid",
      Calories: "862 kcal per 100ml",
      TransFat: "0g",
    },
    stockCount: 35,
    inStock: true,
    nafdacNumber: "08-6610",
    certifications: ["Raw Virgin Grade", "Cold-Pressed Without Heat", "Non-GMO"],
    isFeatured: true,
    isBestseller: true,
    isNew: false,
    processVideo: {
      title: "Cold Pressing & Filtering Fresh Coconuts",
      videoUrl: "/videos/coconut-oil-manufacturing.mp4",
      posterUrl: "/images/coconut-oil.jpg",
      duration: "1:05",
      categoryName: "Baking Ingredients",
      highlights: [
        "Pressed Cold Without Heat",
        "Great for High-Heat Baking",
        "100% Pure & Clear",
      ],
    },
    seoTitle: "Cold-Pressed Virgin Coconut Oil 500ml – Mervida",
    seoDescription:
      "Raw cold-pressed virgin coconut oil for baking, cooking, and healthy nutrition.",
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: "prod-carrot-oil",
    name: "Natural Carrot Color Oil (Beta-Carotene)",
    slug: "food-grade-carrot-extract-oil",
    shortDescription:
      "Pure carrot oil rich in natural Beta-Carotene. Gives foods a rich, natural yellow-orange color.",
    fullDescription:
      "A concentrated natural oil made from fresh carrots. It gives foods, baked goods, and butter a beautiful natural yellow-orange color—without using fake chemical dyes or artificial colors.",
    images: ["/images/carrot-oil.jpg"],
    price: 6500,
    unit: "250ml",
    categoryId: "cat-food-chemicals",
    variants: [],
    nutritionSpecs: {
      NaturalColor: "Pure Carrot Beta-Carotene",
      Use: "Natural Color for Foods & Baking",
      Grade: "Food-Grade Plant Extract",
    },
    stockCount: 25,
    inStock: true,
    nafdacNumber: "08-9941",
    certifications: [
      "100% Food-Grade",
      "Natural Plant Color",
      "Lab Tested & Certified",
    ],
    isFeatured: true,
    isBestseller: false,
    isNew: true,
    processVideo: {
      title: "Extracting Pure Natural Oil From Fresh Carrots",
      videoUrl: "/videos/carrot-oil-manufacturing.mp4",
      posterUrl: "/images/carrot-oil.jpg",
      duration: "1:20",
      categoryName: "Natural Food Colorants",
      highlights: [
        "Natural Plant Color",
        "Safe for Baking & Cooking",
        "Clean Batch Bottled",
      ],
    },
    seoTitle: "Natural Carrot Color Oil 250ml – Mervida",
    seoDescription:
      "Concentrated natural carrot oil for safe, plant-based food coloring.",
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
    "/images/garri.jpeg",
    "/images/palm-oil.jpeg",
    "/images/plantain-flower.jpeg",
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
  const version = localStorage.getItem(STORE_VERSION_KEY);
  if (version !== CURRENT_VERSION) {
    write(KEYS.products, DEFAULT_PRODUCTS);
    write(KEYS.categories, DEFAULT_CATEGORIES);
    write(KEYS.settings, DEFAULT_SETTINGS);
    localStorage.setItem(STORE_VERSION_KEY, CURRENT_VERSION);
  }
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
