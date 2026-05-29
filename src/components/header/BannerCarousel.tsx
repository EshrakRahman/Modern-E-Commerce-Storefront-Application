import { useRef, useState, useEffect, useCallback } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { getBanners } from "@/api/banners";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const AUTO_ADVANCE_MS = 6000;

function SlideIndicator({
  total,
  active,
  onSelect,
  isLightText,
}: {
  total: number;
  active: number;
  onSelect: (i: number) => void;
  isLightText: boolean;
}) {
  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2.5 z-20">
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          onClick={() => onSelect(i)}
          className={cn(
            "w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer",
            i === active
              ? isLightText
                ? "bg-white w-6"
                : "bg-zinc-950 w-6"
              : isLightText
                ? "bg-white/40 hover:bg-white/70"
                : "bg-zinc-300 hover:bg-zinc-400"
          )}
          aria-label={`Go to slide ${i + 1}`}
        />
      ))}
    </div>
  );
}

export default function BannerCarousel() {
  const { data: banners } = useSuspenseQuery({
    queryKey: ["banners"],
    queryFn: getBanners,
  });

  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const slideCount = banners.length;

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    clearTimer();
    if (slideCount <= 1) return;
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slideCount);
    }, AUTO_ADVANCE_MS);
  }, [clearTimer, slideCount]);

  useEffect(() => {
    if (isPaused) {
      clearTimer();
    } else {
      startTimer();
    }
  }, [isPaused, startTimer, clearTimer]);

  useEffect(() => {
    return clearTimer;
  }, [clearTimer]);

  if (!banners || banners.length === 0) return null;

  const goToSlide = (i: number) => {
    setCurrent(i);
    startTimer();
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + slideCount) % slideCount);
    startTimer();
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slideCount);
    startTimer();
  };

  const activeBanner = banners[current];
  const isLightText = activeBanner?.text_color === "light";

  return (
    <section
      className="relative w-full overflow-hidden h-[520px] md:h-[500px] lg:h-[580px] xl:h-[620px] group/carousel"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        className="flex h-full transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {banners.map((banner, index) => {
          const isActive = index === current;
          const bannerIsLightText = banner.text_color === "light";

          return (
            <div
              key={banner.id}
              className="w-full h-full shrink-0 flex flex-col-reverse md:flex-row relative overflow-hidden"
              style={{ background: banner.bg_color ?? "#F2F0F1" }}
            >
              {/* Content Column */}
              <div className="w-full md:w-1/2 lg:w-[42%] h-[260px] md:h-full flex items-center px-6 md:px-12 lg:px-20 py-6 md:py-0">
                <div className="flex flex-col justify-center h-full">
                  <h2
                    className={cn(
                      "text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight mb-3 md:mb-4 transition-all duration-700 ease-out transform",
                      isActive ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4",
                      bannerIsLightText ? "text-white" : "text-zinc-950"
                    )}
                  >
                    {banner.title}
                  </h2>
                  {banner.subtitle && (
                    <p
                      className={cn(
                        "text-xs sm:text-sm md:text-base lg:text-lg mb-4 md:mb-6 leading-relaxed transition-all duration-700 ease-out transform delay-100",
                        isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
                        bannerIsLightText ? "text-white/80" : "text-zinc-500"
                      )}
                    >
                      {banner.subtitle}
                    </p>
                  )}
                  <div
                    className={cn(
                      "transition-all duration-700 ease-out transform delay-200",
                      isActive ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-95"
                    )}
                  >
                    <Link to={banner.cta_url}>
                      <Button
                        className={cn(
                          "rounded-full px-6 md:px-8 py-5 md:py-6 text-sm md:text-base font-semibold hover:scale-105 hover:shadow-lg transition-all duration-300 cursor-pointer",
                          bannerIsLightText
                            ? "bg-white text-zinc-950 hover:bg-zinc-100"
                            : "bg-zinc-950 text-white hover:bg-zinc-800"
                        )}
                      >
                        {banner.cta_text}
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Image Column */}
              <div className="w-full md:w-1/2 lg:w-[58%] h-[260px] md:h-full relative overflow-hidden">
                <picture className="w-full h-full block">
                  {banner.desktop_image && <source media="(min-width: 768px)" srcSet={banner.desktop_image} />}
                  <img
                    src={banner.mobile_image ?? banner.desktop_image ?? ""}
                    alt={banner.title}
                    className="w-full h-full object-cover"
                  />
                </picture>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Arrows */}
      {slideCount > 1 && (
        <>
          <button
            onClick={prevSlide}
            className={cn(
              "absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2.5 md:p-3.5 rounded-full backdrop-blur-md transition-all duration-300 opacity-0 group-hover/carousel:opacity-100 focus:opacity-100 hover:scale-110 cursor-pointer hidden md:flex items-center justify-center",
              isLightText
                ? "bg-white/10 hover:bg-white/20 text-white border border-white/20"
                : "bg-black/5 hover:bg-black/10 text-zinc-950 border border-black/10"
            )}
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          <button
            onClick={nextSlide}
            className={cn(
              "absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2.5 md:p-3.5 rounded-full backdrop-blur-md transition-all duration-300 opacity-0 group-hover/carousel:opacity-100 focus:opacity-100 hover:scale-110 cursor-pointer hidden md:flex items-center justify-center",
              isLightText
                ? "bg-white/10 hover:bg-white/20 text-white border border-white/20"
                : "bg-black/5 hover:bg-black/10 text-zinc-950 border border-black/10"
            )}
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </>
      )}

      {/* Slide Indicators */}
      <SlideIndicator
        total={slideCount}
        active={current}
        onSelect={goToSlide}
        isLightText={isLightText}
      />
    </section>
  );
}
