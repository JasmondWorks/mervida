export type OrderStatus =
  | "pending"
  | "confirmed"
  | "dispatched"
  | "delivered"
  | "cancelled";

export interface Variant {
  label: string;
  price: number;
  stock?: number;
}

export interface Product {
  id: string; // unique ID
  name: string; // display name
  slug: string; // url-safe name (nameSlug in doc)
  categoryId: string; // category slug
  images: string[]; // first is primary
  shortDescription: string;
  fullDescription: string;
  price: number; // base price
  unit: string; // e.g. 500g
  variants: Variant[] | null;
  nutritionSpecs: Record<string, string> | null;
  certifications: string[];
  nafdacNumber: string | null;
  inStock: boolean;
  stockCount: number | null;
  isFeatured: boolean;
  isBestseller: boolean;
  isNew: boolean;
  createdAt: string;
  updatedAt: string;
  seoTitle: string;
  seoDescription: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string; // category slug
  description: string;
  image?: string; // category card image
  createdAt: string;
}

export interface OrderItem {
  productName: string;
  quantity: number;
  unitPrice: number;
  variantLabel?: string;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminSettings {
  whatsappNumber: string;
  whatsappMessageTemplate: string;
  adminPassword: string;
  businessName: string;
  businessEmail: string;
  carouselImages: string[];
}

export interface CartItem {
  productId: string;
  productName: string;
  nameSlug: string;
  image: string;
  price: number;
  unit: string;
  variantLabel: string | null;
  quantity: number;
}
