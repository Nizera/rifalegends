"use client";

import { useState, useEffect, useRef } from "react";

const images = [
  { src: "/kit 80 legends.jpeg", alt: "Kit 80 Legends" },
  { src: "/kit messi.jpeg", alt: "Kit Messi" },
  { src: "/kit cr7.jpeg", alt: "Kit CR7" },
  { src: "/kit mbappe.jpeg", alt: "Kit Mbappé" },
  { src: "/kit yamal.jpeg", alt: "Kit Yamal" },
];

export default function PrizeCarousel() {
  const [order, setOrder] = useState([0, 1, 2, 3, 4]);
  const [isSliding, setIsSliding] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const autoPlayTimer = useRef<NodeJS.Timeout | null>(null);

  const nextSlide = () => {
    if (isSliding) return;
    setIsSliding(true);

    setTimeout(() => {
      setOrder((prev) => {
        const [first, ...rest] = prev;
        return [...rest, first];
      });
      setIsSliding(false);
    }, 350);
  };

  const resetAutoplay = () => {
    if (autoPlayTimer.current) {
      clearInterval(autoPlayTimer.current);
    }
    autoPlayTimer.current = setInterval(() => {
      nextSlide();
    }, 3500);
  };

  useEffect(() => {
    resetAutoplay();
    return () => {
      if (autoPlayTimer.current) {
        clearInterval(autoPlayTimer.current);
      }
    };
  }, [isSliding, order]);

  // Simplified touch handler for smooth mobile swiping (left/right)
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;

    // If swiped horizontally with enough distance
    if (Math.abs(diff) > 40) {
      nextSlide();
    }
    setTouchStart(null);
  };

  return (
    <div className="relative w-full aspect-[4/3] flex items-center justify-center overflow-visible py-8 select-none">
      {/* Background Ultimate Team Glow Effect */}
      <div className="absolute inset-0 bg-gradient-radial from-gold-500/20 via-transparent to-transparent rounded-full filter blur-2xl pointer-events-none" />

      <div 
        className="relative w-[78%] h-[88%] cursor-pointer"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={nextSlide}
      >
        {order.map((imageIdx, stackPosition) => {
          const isTopCard = stackPosition === 0;
          const image = images[imageIdx];

          let transformStyle = "";
          let opacity = 1;
          let zIndex = 10 - stackPosition;

          if (isTopCard && isSliding) {
            transformStyle = "translateX(-120%) rotate(-15deg) scale(0.95)";
            opacity = 0;
          } else {
            const direction = stackPosition % 2 === 0 ? 1 : -1;
            const rotation = direction * (stackPosition * 3);
            const yOffset = -stackPosition * 10;
            const scale = 1 - stackPosition * 0.04;

            transformStyle = `translate(${direction * 5}px, ${yOffset}px) rotate(${rotation}deg) scale(${scale})`;
            opacity = Math.max(0.4, 1 - stackPosition * 0.15);
          }

          return (
            <div
              key={imageIdx}
              className="absolute inset-0 shadow-2xl rounded-2xl border-2 border-gold-300/60 overflow-hidden bg-deep transition-all duration-300 ease-out will-change-transform"
              style={{
                transform: transformStyle,
                zIndex: zIndex,
                opacity: opacity,
              }}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover pointer-events-none"
                loading="eager"
              />
              {isTopCard && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
