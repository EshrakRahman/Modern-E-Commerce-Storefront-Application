import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ShopPage from "../Shop";
import { getProducts } from "@/api/products";
import { useSearch, useNavigate } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Mock router hooks
vi.mock("@tanstack/react-router", () => ({
  useSearch: vi.fn(),
  useNavigate: vi.fn(),
  Link: ({ children }: { children: React.ReactNode }) => <a>{children}</a>,
}));

// Mock products API
vi.mock("@/api/products", () => ({
  getProducts: vi.fn(),
}));

// Mock categories API
vi.mock("@/api/categories", () => ({
  getCategories: vi.fn(() => Promise.resolve([])),
}));

// Mock Auth, Wishlist, and Cart Contexts
vi.mock("@/context/AuthContext", () => ({
  useAuth: () => ({ user: null }),
}));
vi.mock("@/context/WishlistContext", () => ({
  useWishlist: () => ({
    isWishlisted: () => false,
    add: vi.fn(),
    remove: vi.fn(),
  }),
}));
vi.mock("@/context/CartContext", () => ({
  useCart: () => ({
    addItem: vi.fn(),
  }),
}));

const mockProduct = {
  id: 1,
  name: "Classic Fit Oxford Shirt",
  slug: "classic-fit-oxford-shirt",
  category: "clothing",
  description: "A premium shirt.",
  price: 49.99,
  compare_price: 69.99,
  sale_price: 34.99,
  has_discount: true,
  quantity: 50,
  image: "http://example.com/image.png",
  sizes: [{ id: 1, name: "M", stock: 10 }],
  is_featured: true,
  created_at: "2026-05-25 12:00:00",
};

describe("ShopPage Component", () => {
  let queryClient: QueryClient;
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
  });

  it("should query getProducts with cursor and per_page from route search parameters", async () => {
    vi.mocked(useSearch).mockReturnValue({
      cursor: "some-cursor",
      category: "clothing",
      minPrice: undefined,
      maxPrice: undefined,
      size: undefined,
    });

    vi.mocked(getProducts).mockResolvedValue({
      data: [mockProduct],
      meta: {
        per_page: 12,
        next_cursor: "next-token",
        prev_cursor: "prev-token",
      },
    });

    render(
      <QueryClientProvider client={queryClient}>
        <ShopPage />
      </QueryClientProvider>
    );

    // Verify it fetches with cursor: "some-cursor"
    expect(getProducts).toHaveBeenCalledWith({
      cursor: "some-cursor",
      per_page: 12,
      category: "clothing",
      minPrice: undefined,
      maxPrice: undefined,
      size: undefined,
    });

    // Wait for the elements to load and verify product name is displayed
    const productName = await screen.findByText("Classic Fit Oxford Shirt");
    expect(productName).toBeInTheDocument();

    // Verify showing count uses loaded item count
    expect(screen.getByText("Showing 1 product")).toBeInTheDocument();
  });

  it("should trigger useNavigate with next cursor when next button is clicked", async () => {
    vi.mocked(useSearch).mockReturnValue({
      cursor: undefined,
      category: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      size: undefined,
    });

    vi.mocked(getProducts).mockResolvedValue({
      data: [mockProduct],
      meta: {
        per_page: 12,
        next_cursor: "next-token",
        prev_cursor: null,
      },
    });

    render(
      <QueryClientProvider client={queryClient}>
        <ShopPage />
      </QueryClientProvider>
    );

    // Wait for page to load
    await screen.findByText("Classic Fit Oxford Shirt");

    // Find and click the next button
    const nextButton = screen.getByRole("button", { name: "Next →" });
    fireEvent.click(nextButton);

    // Verify navigation is triggered with the next cursor
    expect(mockNavigate).toHaveBeenCalledWith({
      search: expect.objectContaining({
        cursor: "next-token",
      }),
    });
  });

  it("should query getProducts with cleaned cursor and prices when search params contain quotes", async () => {
    vi.mocked(useSearch).mockReturnValue({
      cursor: '"some-cursor"',
      category: '"clothing"',
      minPrice: '"50"',
      maxPrice: '"100"',
      size: '"M"',
    });

    vi.mocked(getProducts).mockResolvedValue({
      data: [mockProduct],
      meta: {
        per_page: 12,
        next_cursor: "next-token",
        prev_cursor: null,
      },
    });

    render(
      <QueryClientProvider client={queryClient}>
        <ShopPage />
      </QueryClientProvider>
    );

    // Verify it strips quotes and parses them correctly
    expect(getProducts).toHaveBeenCalledWith({
      cursor: "some-cursor",
      per_page: 12,
      category: "clothing",
      minPrice: 50,
      maxPrice: 100,
      size: "M",
    });

    const productName = await screen.findByText("Classic Fit Oxford Shirt");
    expect(productName).toBeInTheDocument();
  });

  it("should render PaginationLimitFallback when page >= 3 on unfiltered Shop page", async () => {
    vi.mocked(useSearch).mockReturnValue({
      cursor: "some-cursor",
      category: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      size: undefined,
      page: 3,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <ShopPage />
      </QueryClientProvider>
    );

    // Verify getProducts was NOT called because query is disabled when limit is reached
    expect(getProducts).not.toHaveBeenCalled();

    // Verify limit fallback header is shown
    const fallbackText = await screen.findByText("Looking for Something Specific?");
    expect(fallbackText).toBeInTheDocument();
    expect(screen.getByText("General Listing Limit Reached")).toBeInTheDocument();
  });

  it("should NOT render PaginationLimitFallback when page >= 3 but filtered by category", async () => {
    vi.mocked(useSearch).mockReturnValue({
      cursor: "some-cursor",
      category: "clothing",
      minPrice: undefined,
      maxPrice: undefined,
      size: undefined,
      page: 3,
    });

    vi.mocked(getProducts).mockResolvedValue({
      data: [mockProduct],
      meta: {
        per_page: 12,
        next_cursor: null,
        prev_cursor: null,
      },
    });

    render(
      <QueryClientProvider client={queryClient}>
        <ShopPage />
      </QueryClientProvider>
    );

    // Verify getProducts was called since a filter is present
    expect(getProducts).toHaveBeenCalled();

    // Verify product grid renders rather than fallback
    const productName = await screen.findByText("Classic Fit Oxford Shirt");
    expect(productName).toBeInTheDocument();
    expect(screen.queryByText("Looking for Something Specific?")).not.toBeInTheDocument();
  });

  it("should query getProducts with brand filter from route search parameters", async () => {
    vi.mocked(useSearch).mockReturnValue({
      cursor: undefined,
      category: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      size: undefined,
      brand: "nike",
    });

    vi.mocked(getProducts).mockResolvedValue({
      data: [mockProduct],
      meta: {
        per_page: 12,
        next_cursor: null,
        prev_cursor: null,
      },
    });

    render(
      <QueryClientProvider client={queryClient}>
        <ShopPage />
      </QueryClientProvider>
    );

    expect(getProducts).toHaveBeenCalledWith(expect.objectContaining({
      brand: "nike",
    }));
  });
});
