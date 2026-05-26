import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import CategoryProducts from "../CategoryProducts";
import { getProducts } from "@/api/products";
import { getCategories } from "@/api/categories";
import { useParams, useSearch, useNavigate } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Mock router hooks
vi.mock("@tanstack/react-router", () => ({
  useParams: vi.fn(),
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
  getCategories: vi.fn(),
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

describe("CategoryProducts Page", () => {
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
    vi.mocked(getCategories).mockResolvedValue([
      { id: 1, name: "Clothing", slug: "clothing", description: "", created_at: "2026-05-25 12:00:00" },
      { id: 2, name: "Shoes", slug: "shoes", description: "", created_at: "2026-05-25 12:00:00" },
    ]);
  });

  it("should query getProducts with category undefined when slug is 'all'", async () => {
    vi.mocked(useParams).mockReturnValue({ slug: "all" });
    vi.mocked(useSearch).mockReturnValue({ cursor: undefined, q: undefined });

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
        <CategoryProducts />
      </QueryClientProvider>
    );

    // Verify it fetches with category: undefined because slug is 'all'
    expect(getProducts).toHaveBeenCalledWith({
      search: undefined,
      category: undefined,
      sort: "latest",
      cursor: undefined,
      per_page: 12,
      minPrice: undefined,
      maxPrice: undefined,
      size: undefined,
    });

    const productName = await screen.findByText("Classic Fit Oxford Shirt");
    expect(productName).toBeInTheDocument();
  });

  it("should query getProducts with category slug when slug is not 'all'", async () => {
    vi.mocked(useParams).mockReturnValue({ slug: "shoes" });
    vi.mocked(useSearch).mockReturnValue({ cursor: undefined, q: undefined });

    vi.mocked(getProducts).mockResolvedValue({
      data: [mockProduct],
      meta: {
        per_page: 12,
        next_cursor: "next-token-shoes",
        prev_cursor: null,
      },
    });

    render(
      <QueryClientProvider client={queryClient}>
        <CategoryProducts />
      </QueryClientProvider>
    );

    // Verify it fetches with category: 'shoes'
    expect(getProducts).toHaveBeenCalledWith({
      search: undefined,
      category: "shoes",
      sort: "latest",
      cursor: undefined,
      per_page: 12,
      minPrice: undefined,
      maxPrice: undefined,
      size: undefined,
    });
  });

  it("should trigger useNavigate with next cursor when next button is clicked on CategoryProducts", async () => {
    vi.mocked(useParams).mockReturnValue({ slug: "shoes" });
    vi.mocked(useSearch).mockReturnValue({ cursor: undefined, q: undefined });

    vi.mocked(getProducts).mockResolvedValue({
      data: [mockProduct],
      meta: {
        per_page: 12,
        next_cursor: "next-token-shoes",
        prev_cursor: null,
      },
    });

    render(
      <QueryClientProvider client={queryClient}>
        <CategoryProducts />
      </QueryClientProvider>
    );

    // Wait for the elements to load and verify product name is displayed
    await screen.findByText("Classic Fit Oxford Shirt");

    // Find and click the next button
    const nextButton = screen.getByRole("button", { name: "Next →" });
    fireEvent.click(nextButton);

    // Verify navigation is triggered with the next cursor
    expect(mockNavigate).toHaveBeenCalledWith({
      search: expect.objectContaining({
        cursor: "next-token-shoes",
      }),
    });
  });

  it("should render PaginationLimitFallback when page >= 3 on unfiltered CategoryProducts page (slug = 'all')", async () => {
    vi.mocked(useParams).mockReturnValue({ slug: "all" });
    vi.mocked(useSearch).mockReturnValue({
      cursor: "some-cursor",
      q: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      size: undefined,
      page: 3,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <CategoryProducts />
      </QueryClientProvider>
    );

    // Verify getProducts was NOT called
    expect(getProducts).not.toHaveBeenCalled();

    // Verify limit fallback header is shown
    const fallbackText = await screen.findByText("Looking for Something Specific?");
    expect(fallbackText).toBeInTheDocument();
    expect(screen.getByText("General Listing Limit Reached")).toBeInTheDocument();
  });

  it("should NOT render PaginationLimitFallback when page >= 3 but filtered by slug != 'all'", async () => {
    vi.mocked(useParams).mockReturnValue({ slug: "shoes" });
    vi.mocked(useSearch).mockReturnValue({
      cursor: "some-cursor",
      q: undefined,
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
        <CategoryProducts />
      </QueryClientProvider>
    );

    // Verify getProducts was called since slug != 'all'
    expect(getProducts).toHaveBeenCalled();

    // Verify product grid renders rather than fallback
    const productName = await screen.findByText("Classic Fit Oxford Shirt");
    expect(productName).toBeInTheDocument();
    expect(screen.queryByText("Looking for Something Specific?")).not.toBeInTheDocument();
  });
});

