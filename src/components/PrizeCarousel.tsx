"use client";

import { useState } from "react";

const images = [
  { src: "/kit 80 legends.jpeg", alt: "Kit 80 Legends" },
  { src: "/kit messi.jpeg", alt: "Kit Messi" },
  { src: "/kit cr7.jpeg", alt: "Kit CR7" },
  { src: "/kit mbappe.jpeg", alt: "Kit Mbappé" },
  { src: "/kit yamal.jpeg", alt: "Kit Yamal" },
];

export default function PrizeCarousel() {
  return (
    <div className="relative w-full aspect-[4/3] flex items-center justify-center overflow-hidden">
      <div className="relative w-[80%] h-[80%]">
        {images.map((image, index) => (
          <div
            key={index}
            className="absolute inset-0 transition-all duration-500 ease-out shadow-2xl rounded-2xl border-2 border-gold-300/30 overflow-hidden"
            style={{
              transform: `rotate(${(index - 2) * 5}deg) translateY(${(index - 2) * 20}px)`,
              zIndex: index,
            }}
          >
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
