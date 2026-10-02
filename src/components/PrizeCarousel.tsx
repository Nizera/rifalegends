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

  // Trigger the transition: slide the top card down and move it to the back
  const nextSlide = () => {
    if (isSliding) return;
    setIsSliding(true);

    // After animation finishes (500ms), rotate the order array
    setTimeout(() => {
      setOrder((prev) => {
        const [first, ...rest] = prev;
        return [...rest, first];
      });
      setIsSliding(false);
      setDragOffset({ x: 0, y: 0 });
    }, 500);
  };

  // Reset autoplay timer
  const resetAutoplay = () => {
    if (autoPlayTimer.current) {
      clearInterval(autoPlayTimer.current);
    }
    autoPlayTimer.current = setInterval(() => {
      nextSlide();
    }, 3000);
  };

  // Setup autoplay
  useEffect(() => {
    resetAutoplay();
    return () => {
      if (autoPlayTimer.current) {
        clearInterval(autoPlayTimer.current);
      }
    };
  }, [isSliding, order]);

  // Touch and Mouse handlers for dragging/swiping
  const handleStart = (clientX: number, clientY: number) => {
    if (isSliding) return;
    setDragStart({ x: clientX, y: clientY });
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (!dragStart) return;
    const offsetX = clientX - dragStart.x;
    const offsetY = clientY - dragStart.y;
    // Allow dragging downwards or sideways
    setDragOffset({ x: offsetX, y: offsetY });
  };

  const handleEnd = () => {
    if (!dragStart) return;
    const distance = Math.sqrt(dragOffset.x ** 2 + dragOffset.y ** 2);

    if (distance > 80) {
      // Trigger slide down to back
      nextSlide();
    } else {
      // Bounce back to center
      setDragOffset({ x: 0, y: 0 });
    }
    setDragStart(null);
  };

  return (
    <div className="relative w-full aspect-[4/3] flex items-center justify-center overflow-visible py-8 select-none">
      <div 
        className="relative w-[75%] h-[90%] touch-none cursor-grab active:cursor-grabbing"
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

          // Determine visual hierarchy & layout styling based on stack position (0 is front, 4 is back)
          let transformStyle = "";
          let opacity = 1;
          let zIndex = 10 - stackPosition;

          if (isTopCard) {
            if (isSliding) {
              // Sliding away state (rolls down / out of view)
              transformStyle = "translateY(120%) rotate(15deg) scale(0.95)";
              opacity = 0;
            } else {
              // Active top card translation (includes user drag offset)
              transformStyle = `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${dragOffset.x * 0.05}deg) scale(1)`;
            }
          } else {
            // Cards stacked behind with alternating fan effect
            // stackPosition 1, 2, 3, 4
            const offsetMultiplier = stackPosition;
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
              className={`absolute inset-0 shadow-2xl rounded-2xl border-2 border-gold-300/40 overflow-hidden bg-deep transition-all duration-300 ease-out`}
              style={{
                transform: transformStyle,
                zIndex: zIndex,
                opacity: opacity,
                transition: dragStart && isTopCard ? "none" : undefined, // No transition lag while dragging
              }}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover pointer-events-none"
              />
              {/* Highlight Overlay on top card */}
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
