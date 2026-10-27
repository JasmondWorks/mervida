import type { Product, Category, Order, AdminSettings } from "@/app/lib/types";

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  coverImage: string | null;
  status: "draft" | "published";
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: { "Content-Type": "application/json", ...options?.headers },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request to ${url} failed (${res.status})`);
  }
  return res.json();
}

// ── Products ──────────────────────────────────────────────────────────────
export const fetchProducts = () => request<Product[]>("/api/products");
export const fetchProduct = (id: string) => request<Product>(`/api/products/${id}`);
export const createProduct = (data: Partial<Product>) =>
  request<Product>("/api/products", { method: "POST", body: JSON.stringify(data) });
export const updateProduct = (id: string, data: Partial<Product>) =>
  request<Product>(`/api/products/${id}`, { method: "PUT", body: JSON.stringify(data) });
export const deleteProductApi = (id: string) =>
  request<{ ok: true }>(`/api/products/${id}`, { method: "DELETE" });

// ── Categories ────────────────────────────────────────────────────────────
export const fetchCategories = () => request<Category[]>("/api/categories");
export const createCategory = (data: Partial<Category>) =>
  request<Category>("/api/categories", { method: "POST", body: JSON.stringify(data) });
export const updateCategory = (id: string, data: Partial<Category>) =>
  request<Category>(`/api/categories/${id}`, { method: "PUT", body: JSON.stringify(data) });
export const deleteCategoryApi = (id: string) =>
  request<{ ok: true }>(`/api/categories/${id}`, { method: "DELETE" });

// ── Blog ──────────────────────────────────────────────────────────────────
export const fetchBlogPosts = () => request<BlogPost[]>("/api/blog");
export const fetchBlogPost = (id: string) => request<BlogPost>(`/api/blog/${id}`);
export const fetchBlogPostBySlug = (slug: string) =>
  request<BlogPost | null>(`/api/blog?slug=${encodeURIComponent(slug)}`);
export const createBlogPost = (data: Partial<BlogPost>) =>
  request<BlogPost>("/api/blog", { method: "POST", body: JSON.stringify(data) });
export const updateBlogPost = (id: string, data: Partial<BlogPost>) =>
  request<BlogPost>(`/api/blog/${id}`, { method: "PUT", body: JSON.stringify(data) });
export const deleteBlogPost = (id: string) =>
  request<{ ok: true }>(`/api/blog/${id}`, { method: "DELETE" });

// ── Orders ────────────────────────────────────────────────────────────────
export const fetchOrders = () => request<Order[]>("/api/orders");
export const createOrder = (data: Partial<Order>) =>
  request<Order>("/api/orders", { method: "POST", body: JSON.stringify(data) });
export const updateOrder = (id: string, data: Partial<Order>) =>
  request<Order>(`/api/orders/${id}`, { method: "PUT", body: JSON.stringify(data) });
export const deleteOrderApi = (id: string) =>
  request<{ ok: true }>(`/api/orders/${id}`, { method: "DELETE" });

// ── Settings ──────────────────────────────────────────────────────────────
export const fetchSettings = () => request<AdminSettings>("/api/settings");
export const updateSettings = (data: Partial<AdminSettings>) =>
  request<AdminSettings>("/api/settings", { method: "PUT", body: JSON.stringify(data) });
