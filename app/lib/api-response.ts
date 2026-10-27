import { NextResponse } from "next/server";

export interface Pagination {
  page: number;
  totalPages: number;
  totalCount: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

export interface ApiResponse<T> {
  status: "success" | "error";
  data: T | null;
  pagination: Pagination | null;
  message: string | null;
}

export function apiSuccess<T>(
  data: T,
  options?: {
    pagination?: Pagination | null;
    message?: string | null;
    status?: number;
  }
): NextResponse<ApiResponse<T>> {
  const body: ApiResponse<T> = {
    status: "success",
    data,
    pagination: options?.pagination ?? null,
    message: options?.message ?? null,
  };
  return NextResponse.json(body, { status: options?.status ?? 200 });
}

export function apiError(
  message: string,
  status = 400,
  data: any = null
): NextResponse<ApiResponse<null>> {
  const body: ApiResponse<null> = {
    status: "error",
    data,
    pagination: null,
    message,
  };
  return NextResponse.json(body, { status });
}

export function parsePaginationParams(
  urlOrParams: string | URL | URLSearchParams,
  defaultLimit = 10
) {
  let searchParams: URLSearchParams;
  if (typeof urlOrParams === "string") {
    searchParams = new URL(urlOrParams, "http://localhost").searchParams;
  } else if (urlOrParams instanceof URL) {
    searchParams = urlOrParams.searchParams;
  } else {
    searchParams = urlOrParams;
  }

  const pageRaw = parseInt(searchParams.get("page") || "1", 10);
  const limitRaw = parseInt(searchParams.get("limit") || String(defaultLimit), 10);
  const page = isNaN(pageRaw) || pageRaw < 1 ? 1 : pageRaw;
  const limit = isNaN(limitRaw) || limitRaw < 1 ? defaultLimit : Math.min(100, limitRaw);
  const skip = (page - 1) * limit;

  return { page, limit, skip };
}

export function buildPagination(
  totalCount: number,
  page: number,
  limit: number
): Pagination {
  const safeLimit = Math.max(1, limit);
  const totalPages = Math.max(1, Math.ceil(totalCount / safeLimit));
  return {
    page,
    totalPages,
    totalCount,
    hasPrevious: page > 1,
    hasNext: page < totalPages,
  };
}
