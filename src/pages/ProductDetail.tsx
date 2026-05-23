import { useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getProductBySlug } from "@/api/products.ts";
import { getProductReviews } from "@/api/reviews.ts";
import ProductShowcase from "@/components/product details/ProductShowcase.tsx";
import ProductReviews from "@/components/reviews/ProductReviews.tsx";
import SimilarProducts from "@/components/products/SimilarProducts.tsx";

export default function ProductDetail() {
    const { slug } = useParams({ from: "/products/$slug" });
    const { data: product, isLoading, error } = useQuery({
        queryKey: ['product', slug],
        queryFn: () => getProductBySlug(slug),
        enabled: !!slug,
    });

    const { data: reviewsData } = useQuery({
        queryKey: ["reviews", product?.id, 1],
        queryFn: () => getProductReviews(product!.id, 1),
        enabled: !!product?.id,
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="animate-pulse space-y-4 w-full max-w-4xl px-4">
                    <div className="h-8 bg-gray-100 rounded w-1/4 mx-auto" />
                    <div className="h-96 bg-gray-100 rounded-2xl" />
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-2">Product not found</h1>
                    <p className="text-black/60">This product does&apos;t exist or has been removed.</p>
                </div>
            </div>
        );
    }

    const averageRating = reviewsData?.meta?.average_rating ? Number(reviewsData.meta.average_rating) : 0;
    const totalReviews = reviewsData?.meta?.total_reviews ?? 0;

    return (
        <>
            <ProductShowcase 
                product={product} 
                averageRating={averageRating}
                totalReviews={totalReviews}
            />
            <SimilarProducts currentProduct={product} />
            <ProductReviews product={product} />
        </>
    );
}
