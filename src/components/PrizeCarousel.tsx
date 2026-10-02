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
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
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
      setDragOffset({ x: 0, y: 0 });
    }, 500);
  };

  const resetAutoplay = () => {
    if (autoPlayTimer.current) {
      clearInterval(autoPlayTimer.current);
    }
    autoPlayTimer.current = setInterval(() => {
      nextSlide();
    }, 3000);
  };

  useEffect(() => {
    resetAutoplay();
    return () => {
      if (autoPlayTimer.current) {
        clearInterval(autoPlayTimer.current);
      }
    };
  }, [isSliding, order]);

  const handleStart = (clientX: number, clientY: number) => {
    if (isSliding) return;
    setDragStart({ x: clientX, y: clientY });
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (!dragStart) return;
    const offsetX = clientX - dragStart.x;
    const offsetY = clientY - dragStart.y;
    setDragOffset({ x: offsetX, y: offsetY });
  };

  const handleEnd = () => {
    if (!dragStart) return;
    const distance = Math.sqrt(dragOffset.x ** 2 + dragOffset.y ** 2);

    if (distance > 80) {
      nextSlide();
    } else {
      setDragOffset({ x: 0, y: 0 });
    }
    setDragStart(null);
  };

  return (
    <div className="relative w-full aspect-[4/3] flex items-center justify-center overflow-visible py-8 select-none">
      {/* Background Ultimate Team Glow Effect */}
      <div className="absolute inset-0 bg-gradient-radial from-gold-500/20 via-transparent to-transparent rounded-full filter blur-2xl animate-pulse pointer-events-none" />

      <div 
        className="relative w-[75%] h-[90%] touch-none cursor-grab active:cursor-grabbing animate-glow rounded-2xl"
        onTouchStart={(e) => handleStart(e.touches[0].clientX, e.touches[0].clientY)}
        onTouchMove={(e) => handleMove(e.touches[0].clientX, e.touches[0].clientY)}
        onTouchEnd={handleEnd}
        onMouseDown={(e) => handleStart(e.clientX, e.clientY)}
        onMouseMove={(e) => {
          if (e.buttons === 1) handleMove(e.clientX, e.clientY);
        }}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
      >
        {order.map((imageIdx, stackPosition) => {
          const isTopCard = stackPosition === 0;
          const image = images[imageIdx];

          let transformStyle = "";
          let opacity = 1;
          let zIndex = 10 - stackPosition;

          if (isTopCard) {
            if (isSliding) {
              transformStyle = "translateY(120%) rotate(15deg) scale(0.95)";
              opacity = 0;
            } else {
              transformStyle = `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${dragOffset.x * 0.05}deg) scale(1)`;
            }
          } else {
            const direction = stackPosition % 2 === 0 ? 1 : -1;
            const rotation = direction * (stackPosition * 3.5);
            const yOffset = -stackPosition * 12;
            const scale = 1 - stackPosition * 0.045;

            transformStyle = `translate(${direction * 6}px, ${yOffset}px) rotate(${rotation}deg) scale(${scale})`;
            opacity = Math.max(0.4, 1 - stackPosition * 0.15);
          }

          return (
            <div
              key={imageIdx}
              className={`absolute inset-0 shadow-2xl rounded-2xl border-2 border-gold-300/60 overflow-hidden bg-deep transition-all duration-300 ease-out`}
              style={{
                transform: transformStyle,
                zIndex: zIndex,
                opacity: opacity,
                transition: dragStart && isTopCard ? "none" : undefined,
              }}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover pointer-events-none"
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
