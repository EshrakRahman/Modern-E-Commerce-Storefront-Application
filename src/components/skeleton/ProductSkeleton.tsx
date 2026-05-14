import {Skeleton} from "@/components/ui/skeleton.tsx";
import ProductCardSkeleton from "@/components/skeleton/ProductCardSkeleton.tsx";

export default function ProductSkeleton() {
    return (
        <section
            role="status"
            aria-live="polite"
            aria-busy="true"
            aria-label="Loading products..."
            className="best-selling py-8"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-center mb-6">
                    <Skeleton className="title w-71 h-12 rounded-full" />
                </div>

                <div className="relative w-full">
                    <Skeleton className="left-arrow w-5 h-5" />

                    <div
                        className="flex gap-6 overflow-x-auto scroll-smooth scrollbar-hide w-full"
                    >
                        {Array.from({length: 10}).slice(0, 10).map((_, index) => (
                            <div
                                key={index}
                                className="min-w-48 shrink-0"
                            >
                                <ProductCardSkeleton />
                            </div>
                        ))}
                    </div>
                    <Skeleton className="right w-5 h-5" />
                </div>
                <div className="flex justify-center py-8">
                    <Skeleton className="button-c mt-6 h-8 w-30 rounded-full" />
                </div>
            </div>

        </section>
    )
}