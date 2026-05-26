import { describe, it, expect, vi, beforeEach } from "vitest";
import { getProducts } from "../products";
import { apiFetch } from "../client";

// Mock the API client
vi.mock("../client", () => ({
  apiFetch: vi.fn(),
}));

const mockProduct = {
  id: 1,
  name: "Test Shirt",
  slug: "test-shirt",
  category: "Clothing",
  description: "A test shirt",
  price: 25.0,
  compare_price: 30.0,
  sale_price: 20.0,
  has_discount: true,
  quantity: 10,
  image: "http://example.com/image.png",
  sizes: [
    { id: 1, name: "M", stock: 5 }
  ],
  is_featured: true,
  created_at: "2026-05-25 12:00:00",
};

describe("getProducts API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch products without pagination parameters and return paginated wrapper", async () => {
    const mockApiResponse = {
      data: [mockProduct],
      meta: {
        current_page: 1,
        from: 1,
        last_page: 5,
        per_page: 20,
        to: 1,
        total: 100,
      },
    };

    vi.mocked(apiFetch).mockResolvedValueOnce(mockApiResponse);

    const result = await getProducts();

    expect(apiFetch).toHaveBeenCalledWith("/v1/products");
    expect(result.data).toBeDefined();
    expect(result.data[0].id).toBe(mockProduct.id);
    expect(result.meta).toBeDefined();
    expect(result.meta?.total).toBe(100);
    expect(result.meta?.current_page).toBe(1);
  });

  it("should pass pagination query params (page, per_page) to the API path", async () => {
    const mockApiResponse = {
      data: [mockProduct],
      meta: {
        current_page: 2,
        from: 13,
        last_page: 10,
        per_page: 12,
        to: 24,
        total: 120,
      },
    };

    vi.mocked(apiFetch).mockResolvedValueOnce(mockApiResponse);

    const result = await getProducts({ page: 2, per_page: 12 });

    expect(apiFetch).toHaveBeenCalledWith("/v1/products?page=2&per_page=12");
    expect(result.meta?.total).toBe(120);
    expect(result.meta?.current_page).toBe(2);
  });

  it("should pass cursor pagination parameters and parse new meta attributes", async () => {
    const mockApiResponse = {
      data: [mockProduct],
      meta: {
        per_page: 12,
        next_cursor: "next-cursor-token",
        prev_cursor: "prev-cursor-token",
      },
    };

    vi.mocked(apiFetch).mockResolvedValueOnce(mockApiResponse);

    const result = await getProducts({ cursor: "some-cursor-token", per_page: 12 });

    expect(apiFetch).toHaveBeenCalledWith("/v1/products?cursor=some-cursor-token&per_page=12");
    expect(result.meta?.next_cursor).toBe("next-cursor-token");
    expect(result.meta?.prev_cursor).toBe("prev-cursor-token");
    expect(result.meta?.per_page).toBe(12);
  });

  it("should handle limit parameter which returns only data without metadata", async () => {
    const mockApiResponse = {
      data: [mockProduct],
    };

    vi.mocked(apiFetch).mockResolvedValueOnce(mockApiResponse);

    const result = await getProducts({ limit: 5 });

    expect(apiFetch).toHaveBeenCalledWith("/v1/products?limit=5");
    expect(result.data).toHaveLength(1);
    expect(result.meta).toBeUndefined();
  });
});

