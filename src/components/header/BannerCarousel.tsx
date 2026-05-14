import { useRef, useState, useEffect, useCallback } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { getBanners } from "@/api/banners";
import { Button } from "@/components/ui/button";

const AUTO_ADVANCE_MS = 5000;

function SlideIndicator({ total, active, onSelect }: { total: number; active: number; onSelect: (i: number) => void }) {
  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          onClick={() => onSelect(i)}
          className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
            i === active ? "bg-gray-900 w-6" : "bg-gray-400 hover:bg-gray-600"
          }`}
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
  };

  return (
    <section
      className="relative w-full overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {banners.map((banner) => (
          <div
            key={banner.id}
            className="w-full shrink-0 flex flex-col md:flex-row"
            style={{ backgroundColor: "#F2F0F1" }}
          >
            <div className="w-full md:w-1/2 lg:w-3/5 min-h-[200px] md:min-h-[450px] lg:min-h-[550px]">
              <picture>
                {banner.desktop_image && <source media="(min-width: 768px)" srcSet={banner.desktop_image} />}
                <img
                  src={banner.mobile_image ?? banner.desktop_image ?? ""}
                  alt={banner.title}
                  className="w-full h-full object-cover"
                />
              </picture>
            </div>

            <div className="w-full md:w-1/2 lg:w-2/5 flex items-center px-6 md:px-12 lg:px-20 py-10 md:py-0">
              <div>
                <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 text-black">
                  {banner.title}
                </h2>
                {banner.subtitle && (
                  <p className="text-sm md:text-lg lg:text-xl mb-6 text-black/60">
                    {banner.subtitle}
                  </p>
                )}
                <Link to={banner.cta_url}>
                  <Button className="rounded-full px-8 py-5 text-base font-semibold hover:scale-105 hover:shadow-lg transition-all duration-300">
                    {banner.cta_text}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <SlideIndicator total={slideCount} active={current} onSelect={goToSlide} />
    </section>
  );
}
