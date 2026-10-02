"use client";

import { useState } from "react";

const faqs = [
  {
    q: "Como sei se ganhei a rifa?",
    a: "O sorteio é realizado de forma automatizada e transparente. Além disso, transmitimos tudo ao vivo no nosso grupo oficial do WhatsApp e os ganhadores são notificados imediatamente.",
  },
  {
    q: "Como funciona o pagamento?",
    a: "O pagamento é 100% automatizado e seguro através do Mercado Pago via Pix. Assim que você realiza o pagamento, sua cota é reservada e baixada instantaneamente no sistema da rifa.digital.",
  },
  {
    q: "Como recebo o meu prêmio?",
    a: "Após a confirmação do sorteio, nossa equipe entrará em contato diretamente com o ganhador para combinar o envio seguro do prêmio para qualquer lugar do Brasil com frete por nossa conta.",
  },
  {
    q: "O grupo Legends é confiável?",
    a: "Sim! Já contamos com mais de 400 membros ativos em nossa comunidade de colecionadores e entusiastas e presença forte no Instagram (@oscarasdaslegends). Reputação impecável e transparência em todos os sorteios.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full mb-8 animate-fade-up" style={{ animationDelay: "0.85s" }}>
      <div className="flex items-center gap-3 mb-4">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-gold-500/30" />
        <span className="text-[11px] tracking-[0.15em] uppercase text-gold-300 font-bold">
          Dúvidas Frequentes
        </span>
        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-gold-500/30" />
      </div>

      <div className="space-y-2.5">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className="bg-panel/60 backdrop-blur-sm border border-white/[0.06] rounded-xl overflow-hidden transition-all duration-300 hover:border-gold-500/30"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-4 py-3.5 text-left flex items-center justify-between gap-3 text-cream font-bold text-[14px]"
              >
                <span>{faq.q}</span>
                <span className={`text-gold-300 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}>
                  ▼
                </span>
              </button>
              {isOpen && (
                <div className="px-4 pb-4 pt-1 text-[13px] text-[#9fc2ab] leading-relaxed border-t border-white/[0.04]">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
