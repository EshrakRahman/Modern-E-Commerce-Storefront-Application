import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createReview } from "@/api/reviews.ts";
import { Rating } from "@/components/reui/rating.tsx";
import { Button } from "@/components/ui/button.tsx";
import { toast } from "sonner";
import { MessageSquare, X } from "lucide-react";

type WriteReviewModalProps = {
  productId: number;
  productName: string;
  onClose: () => void;
};

export default function WriteReviewModal({
  productId,
  productName,
  onClose,
}: WriteReviewModalProps) {
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const mutation = useMutation({
    mutationFn: (payload: { rating: number; title?: string; body: string }) =>
      createReview(productId, payload),
    onSuccess: () => {
      toast.success(
        "Thank you! Your review has been submitted and is pending admin approval."
      );
      onClose();
      // Invalidate target review queries to refresh details if approved immediately or for caching
      queryClient.invalidateQueries({ queryKey: ["reviews", productId] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (error: any) => {
      toast.error(
        error.message || "Failed to submit review. Please try again."
      );
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (body.trim().length < 10) {
      toast.error("Review body must be at least 10 characters long.");
      return;
    }
    mutation.mutate({
      rating,
      title: title.trim() || undefined,
      body: body.trim(),
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl relative animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1.5 text-gray-400 hover:text-black hover:bg-gray-100 hover:cursor-pointer transition-colors"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        <h3 className="text-xl font-bold mb-1 flex items-center gap-2 pr-8 text-black">
          <MessageSquare className="h-5.5 w-5.5 text-black" /> Write a Review
        </h3>
        <p className="text-xs text-gray-500 mb-6 truncate">
          For product: <span className="font-semibold text-black/80">{productName}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">
              Rating <span className="text-red-500">*</span>
            </label>
            <Rating
              rating={rating}
              editable={true}
              onRatingChange={setRating}
              size="lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">
              Review Title (Optional)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Excellent quality! / Fits perfectly"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black/10 transition-all text-sm text-black"
              maxLength={255}
              disabled={mutation.isPending}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">
              Review Body <span className="text-red-500">*</span>
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Tell others what you think about this product. Must be at least 10 characters..."
              className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black/10 transition-all text-sm text-black h-36 resize-none"
              disabled={mutation.isPending}
              required
            />
            <p className="text-[11px] text-gray-400 mt-1 flex justify-between">
              <span>{body.trim().length} / 2000 characters</span>
              <span>(Minimum 10)</span>
            </p>
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={mutation.isPending}
              className="rounded-full px-5 hover:cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={mutation.isPending || body.trim().length < 10}
              className="rounded-full px-6 bg-black text-white hover:bg-black/80 hover:cursor-pointer disabled:opacity-50"
            >
              {mutation.isPending ? "Submitting..." : "Submit Review"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
