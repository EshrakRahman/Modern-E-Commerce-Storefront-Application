import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProductReviews } from "@/api/reviews.ts";
import type { Product } from "@/schemas/productSchema.ts";
import { Rating } from "@/components/reui/rating.tsx";
import { Button } from "@/components/ui/button.tsx";
import Container from "@/components/layout/Container.tsx";
import { MessageSquare, Calendar, User } from "lucide-react";

type Props = {
  product: Product;
};

export default function ProductReviews({ product }: Props) {
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["reviews", product.id, page],
    queryFn: () => getProductReviews(product.id, page),
  });

  const reviews = data?.data ?? [];
  const meta = data?.meta;
  const averageRating = meta?.average_rating ? Number(meta.average_rating) : 0;
  const totalReviews = meta?.total_reviews ?? 0;

  return (
    <Container className="py-12 border-t border-gray-100 mt-12">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl lg:text-3xl font-bold text-black flex items-center gap-2">
            Customer Reviews <span className="text-gray-400 text-lg font-normal">({totalReviews})</span>
          </h2>
          <div className="flex items-center gap-2 mt-2">
            <Rating rating={averageRating} />
            <span className="font-semibold text-black">{averageRating.toFixed(1)}</span>
            <span className="text-gray-400">out of 5</span>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="border border-gray-100 p-6 rounded-2xl h-44 bg-gray-50" />
          ))}
        </div>
      ) : isError ? (
        <div className="text-center py-10 bg-red-50 border border-red-100 text-red-700 rounded-2xl">
          Failed to load reviews. Please try again.
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 border border-gray-100 rounded-2xl">
          <MessageSquare className="mx-auto h-12 w-12 text-gray-300 mb-3" />
          <h4 className="text-lg font-semibold text-black">No reviews yet</h4>
          <p className="text-gray-500 text-sm mt-1">Only verified buyers can leave a review from their Order details page.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="border border-gray-100 bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Rating rating={review.rating} />
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {review.created_at.split(" ")[0]}
                    </span>
                  </div>
                  {review.title && <h4 className="font-bold text-black text-base mb-1.5">{review.title}</h4>}
                  <p className="text-sm text-gray-600 leading-relaxed break-words">{review.body}</p>
                </div>
                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-50 text-xs text-gray-500">
                  <div className="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center">
                    <User className="h-3.5 w-3.5 text-gray-500" />
                  </div>
                  <span className="font-medium text-black/80">{review.user_name || "Verified Customer"}</span>
                  <span className="ml-auto bg-green-50 text-green-700 text-[10px] px-2 py-0.5 rounded-full font-semibold">
                    Verified Purchase
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Simple Pagination */}
          {data?.meta && data.data.length > 0 && (
            <div className="flex justify-center items-center gap-4 mt-8 pt-4">
              <Button
                size="sm"
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="rounded-full px-4 hover:cursor-pointer"
              >
                Previous
              </Button>
              <span className="text-sm text-gray-600">
                Page {page}
              </span>
              <Button
                size="sm"
                variant="outline"
                disabled={reviews.length < 10}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-full px-4 hover:cursor-pointer"
              >
                Next
              </Button>
            </div>
          )}
        </div>
      )}
    </Container>
  );
}
