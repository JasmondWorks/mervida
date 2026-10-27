import type { Product, Category, Order, AdminSettings } from "@/app/lib/types";
import type { ApiResponse, Pagination } from "@/app/lib/api-response";

export type { ApiResponse, Pagination };

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

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface ProductQueryParams extends PaginationParams {
  category?: string;
  search?: string;
  all?: boolean;
}

export interface CategoryQueryParams extends PaginationParams {
  all?: boolean;
}

export interface BlogQueryParams extends PaginationParams {
  all?: boolean;
}

export interface OrderQueryParams extends PaginationParams {
  status?: string;
  all?: boolean;
}

async function request<T>(url: string, options?: RequestInit): Promise<ApiResponse<T>> {
  const res = await fetch(url, {
    ...options,
    headers: { "Content-Type": "application/json", ...options?.headers },
  });
  const body: ApiResponse<T> = await res.json().catch(() => ({
    status: "error" as const,
    data: null,
    pagination: null,
    message: `Request failed (${res.status})`,
  }));
  if (!res.ok || body.status === "error") {
    throw new Error(body.message || `Request to ${url} failed (${res.status})`);
  }
  return body;
}

// ── Products ──────────────────────────────────────────────────────────────
export const fetchProducts = (params?: ProductQueryParams) => {
  const q = new URLSearchParams();
  if (params?.page) q.set("page", String(params.page));
  if (params?.limit) q.set("limit", String(params.limit));
  if (params?.category) q.set("category", params.category);
  if (params?.search) q.set("search", params.search);
  if (params?.all) q.set("all", "true");
  const qs = q.toString();
  return request<Product[]>(qs ? `/api/products?${qs}` : "/api/products");
};

export const fetchProduct = async (id: string) => {
  const res = await request<Product>(`/api/products/${id}`);
  return res.data;
};

export const createProduct = async (data: Partial<Product>) => {
  const res = await request<Product>("/api/products", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return res.data!;
};

export const updateProduct = async (id: string, data: Partial<Product>) => {
  const res = await request<Product>(`/api/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return res.data!;
};

export const deleteProductApi = async (id: string) => {
  const res = await request<{ id: string }>(`/api/products/${id}`, {
    method: "DELETE",
  });
  return res.data!;
};

// ── Categories ────────────────────────────────────────────────────────────
export const fetchCategories = (params?: CategoryQueryParams) => {
  const q = new URLSearchParams();
  if (params?.page) q.set("page", String(params.page));
  if (params?.limit) q.set("limit", String(params.limit));
  if (params?.all) q.set("all", "true");
  const qs = q.toString();
  return request<Category[]>(qs ? `/api/categories?${qs}` : "/api/categories");
};

export const createCategory = async (data: Partial<Category>) => {
  const res = await request<Category>("/api/categories", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return res.data!;
};

export const updateCategory = async (id: string, data: Partial<Category>) => {
  const res = await request<Category>(`/api/categories/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return res.data!;
};

export const deleteCategoryApi = async (id: string) => {
  const res = await request<{ id: string }>(`/api/categories/${id}`, {
    method: "DELETE",
  });
  return res.data!;
};

// ── Blog ──────────────────────────────────────────────────────────────────
export const fetchBlogPosts = (params?: BlogQueryParams) => {
  const q = new URLSearchParams();
  if (params?.page) q.set("page", String(params.page));
  if (params?.limit) q.set("limit", String(params.limit));
  const qs = q.toString();
  return request<BlogPost[]>(qs ? `/api/blog?${qs}` : "/api/blog");
};

export const fetchAdminBlogPosts = (params?: BlogQueryParams) => {
  const q = new URLSearchParams();
  q.set("all", "true");
  if (params?.page) q.set("page", String(params.page));
  if (params?.limit) q.set("limit", String(params.limit));
  return request<BlogPost[]>(`/api/blog?${q.toString()}`);
};

export const fetchBlogPost = async (id: string) => {
  const res = await request<BlogPost>(`/api/blog/${id}`);
  return res.data;
};

export const fetchBlogPostBySlug = async (slug: string, preview?: boolean) => {
  const q = new URLSearchParams({ slug });
  if (preview) q.set("preview", "true");
  const res = await request<BlogPost | null>(`/api/blog?${q.toString()}`);
  return res.data;
};

export const createBlogPost = async (data: Partial<BlogPost>) => {
  const res = await request<BlogPost>("/api/blog", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return res.data!;
};

export const updateBlogPost = async (id: string, data: Partial<BlogPost>) => {
  const res = await request<BlogPost>(`/api/blog/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return res.data!;
};

export const deleteBlogPost = async (id: string) => {
  const res = await request<{ id: string }>(`/api/blog/${id}`, {
    method: "DELETE",
  });
  return res.data!;
};

// ── Orders ────────────────────────────────────────────────────────────────
export const fetchOrders = (params?: OrderQueryParams) => {
  const q = new URLSearchParams();
  if (params?.page) q.set("page", String(params.page));
  if (params?.limit) q.set("limit", String(params.limit));
  if (params?.status) q.set("status", params.status);
  if (params?.all) q.set("all", "true");
  const qs = q.toString();
  return request<Order[]>(qs ? `/api/orders?${qs}` : "/api/orders");
};

export const createOrder = async (data: Partial<Order>) => {
  const res = await request<Order>("/api/orders", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return res.data!;
};

export const updateOrder = async (id: string, data: Partial<Order>) => {
  const res = await request<Order>(`/api/orders/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return res.data!;
};

export const deleteOrderApi = async (id: string) => {
  const res = await request<{ id: string }>(`/api/orders/${id}`, {
    method: "DELETE",
  });
  return res.data!;
};

// ── Settings ──────────────────────────────────────────────────────────────
export const fetchSettings = async () => {
  const res = await request<AdminSettings>("/api/settings");
  return res.data!;
};

export const updateSettings = async (data: Partial<AdminSettings>) => {
  const res = await request<AdminSettings>("/api/settings", {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return res.data!;
};
