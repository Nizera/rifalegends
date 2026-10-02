"use client";

import { useState, useEffect } from "react";

const buyers = [
  { name: "Lucas M.", city: "São Paulo, SP", count: "5 cotas" },
  { name: "Gabriel S.", city: "Rio de Janeiro, RJ", count: "10 cotas" },
  { name: "Matheus R.", city: "Belo Horizonte, MG", count: "2 cotas" },
  { name: "Rafael C.", city: "Curitiba, PR", count: "20 cotas" },
  { name: "Bruno K.", city: "Porto Alegre, RS", count: "5 cotas" },
  { name: "Thiago P.", city: "Brasília, DF", count: "3 cotas" },
];

export default function LiveNotification() {
  const [current, setCurrent] = useState<typeof buyers[0] | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const showNotification = () => {
      const randomBuyer = buyers[Math.floor(Math.random() * buyers.length)];
      setCurrent(randomBuyer);
      setVisible(true);

      setTimeout(() => {
        setVisible(false);
      }, 4000);
    };

    const interval = setInterval(() => {
      showNotification();
    }, 9000);

    // Initial show after 3s
    const initialTimer = setTimeout(() => {
      showNotification();
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(initialTimer);
    };
  }, []);

  if (!current || !visible) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 animate-fade-up max-w-[280px] bg-panel/95 backdrop-blur-md border border-gold-300/40 rounded-xl p-3 shadow-2xl flex items-center gap-3">
      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-gold-300 to-gold-700 flex items-center justify-center text-ink font-anton text-sm flex-none">
        ⚡
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] text-gold-300 font-bold truncate">
          {current.name} ({current.city})
        </p>
        <p className="text-[12px] text-cream truncate font-medium">
          Acabou de garantir <span className="text-green-light font-bold">{current.count}</span>!
        </p>
      </div>
    </div>
  );
}
