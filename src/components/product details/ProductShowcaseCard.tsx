import { useState, useEffect, useMemo } from "react";
import { X, ZoomIn } from "lucide-react";
import ProductImg from "@/assets/product_one.png";

type Props = { image?: string | null };

export default function ProductShowcaseCard({ image }: Props) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Generate 3 elegant views/crops of the same image to populate the gallery
  const images = useMemo(() => {
    const defaultSrc = image ?? ProductImg;
    if (defaultSrc.includes("images.unsplash.com")) {
      const baseUrl = defaultSrc.split("?")[0];
      return [
        `${baseUrl}?w=800&auto=format&fit=crop&q=80`,
        `${baseUrl}?w=800&auto=format&fit=crop&q=80&crop=entropy`,
        `${baseUrl}?w=800&auto=format&fit=crop&q=80&zoom=1.5`
      ];
    }
    return [defaultSrc, defaultSrc, defaultSrc];
  }, [image]);

  const activeSrc = images[activeImageIndex] || ProductImg;

  // Lock body scrolling when lightbox is active
  useEffect(() => {
    if (isLightboxOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isLightboxOpen]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = ProductImg;
  };

  return (
    <>
      <section className="flex flex-col md:flex-row gap-4">
        {/* Main image container */}
        <div 
          className="main-img w-90 h-72 md:w-85 md:h-100 lg:h-134 md:order-2 bg-[#F3F1EF] p-4 rounded-2xl relative overflow-hidden group/showcase cursor-zoom-in"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onMouseMove={handleMouseMove}
          onClick={() => setIsLightboxOpen(true)}
        >
          {/* Zoom Overlay icon */}
          <div className="absolute bottom-4 right-4 z-10 p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-md text-black/70 opacity-0 group-hover/showcase:opacity-100 transition-opacity duration-300 pointer-events-none">
            <ZoomIn className="h-5 w-5" />
          </div>

          <img
            className="w-full h-full object-cover rounded-xl transition-transform duration-150 ease-out"
            src={activeSrc}
            alt="product"
            onError={handleImageError}
            style={{
              transform: isHovered ? "scale(1.85)" : "scale(1)",
              transformOrigin: isHovered ? `${zoomPos.x}% ${zoomPos.y}%` : "center center",
            }}
          />
        </div>

        {/* Thumbnails */}
        <div className="thumbs flex gap-4 md:flex-col">
          {images.map((imgSrc, idx) => {
            const isActive = idx === activeImageIndex;
            return (
              <div 
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`w-28 h-26.5 md:w-25 md:h-30 lg:w-32 lg:h-36 bg-[#F3F1EF] p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                  isActive 
                    ? "border-2 border-black opacity-100 scale-95 shadow-sm" 
                    : "border border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <img
                  className="w-full h-full object-cover rounded-lg"
                  src={imgSrc}
                  alt={`product thumbnail ${idx + 1}`}
                  onError={handleImageError}
                />
              </div>
            );
          })}
        </div>
      </section>

      {/* Full-screen Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md transition-opacity animate-fade-in">
          {/* Close button */}
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Close image showcase"
          >
            <X className="h-7 w-7" />
          </button>

          {/* Large image wrapper */}
          <div className="max-w-[90vw] max-h-[85vh] p-4 flex items-center justify-center select-none">
            <img
              src={activeSrc}
              alt="zoom product view"
              onError={handleImageError}
              className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl animate-scale-up"
            />
          </div>
        </div>
      )}
    </>
  );
}