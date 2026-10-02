"use client";

import { Suspense } from "react";
import { trackWhatsAppClick } from "@/components/FacebookPixel";
import PrizeCarousel from "@/components/PrizeCarousel";
import Chatbot from "@/components/Chatbot";

function PageContent() {
  const handleCTAClick = () => {
    trackWhatsAppClick();
  };

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-6 sm:py-10">
      <div className="w-full max-w-[480px]">
        {/* Eyebrow */}
        <div className="flex items-center justify-center gap-2 mb-5 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <div className="relative animate-float">
            <div className="w-2 h-2 rounded-full bg-gold-300 animate-pulse" />
            <div className="absolute inset-0 w-2 h-2 rounded-full bg-gold-300 animate-ping opacity-75" />
          </div>
          <span className="text-[11px] tracking-[0.2em] uppercase text-gold-300 font-bold">
            Grupo ativo agora
          </span>
        </div>

        {/* Hero */}
        <h1 className="font-anton text-[36px] sm:text-[42px] leading-[1.02] text-center uppercase text-cream mb-2 animate-fade-up" style={{ animationDelay: "0.2s" }}>
          Como funciona a<br />
          <span className="text-gold-300 drop-shadow-[0_0_20px_rgba(246,217,118,0.3)]">
            Rifa <span className="font-fifa">Legends</span>
          </span>
        </h1>
        <p className="text-center text-[14px] text-[#bcd6c5] max-w-[340px] mx-auto mb-7 font-medium leading-relaxed animate-fade-up" style={{ animationDelay: "0.3s" }}>
          Veja os prêmios da Rifa Legends e participe.
        </p>

        {/* Prêmios */}
        <div className="mb-5 animate-scale-in" style={{ animationDelay: "0.4s" }}>
          <PrizeCarousel />
        </div>

        {/* CTA pós-vídeo */}
        <div className="mb-8 text-center animate-fade-up" style={{ animationDelay: "0.5s" }}>
          <a
            href="https://chat.whatsapp.com/EYD5CmJ0Oer4aeM0zQ9mqu"
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleCTAClick}
            className="group relative block w-full bg-gradient-to-br from-green-light to-green text-cream font-anton text-[17px] tracking-[0.02em] uppercase no-underline py-3.5 rounded-xl border border-gold-500/40 shadow-[0_10px_30px_rgba(20,107,57,0.4)] hover:shadow-[0_10px_50px_rgba(20,107,57,0.7)] hover:scale-[1.03] transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            <span className="relative z-10">Entrar no grupo agora</span>
          </a>
          <div className="mt-2 flex items-center justify-center gap-4 text-[11px] text-[#7d9c88]">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-light animate-pulse" />
              Grupo gratuito
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-6 animate-fade-in" style={{ animationDelay: "0.5s" }}>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-gold-500/30" />
          <span className="text-[11px] tracking-[0.15em] uppercase text-gold-300 font-bold">
            Regras do jogo
          </span>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-gold-500/30" />
        </div>

        {/* Steps */}
        <div className="flex flex-col gap-3 mb-8">
          {[
            { num: 1, title: "Escolha seu número", desc: "Escolha o número da sorte e reserve o seu.", icon: "⚡" },
            { num: 2, title: "Pagamento 100% Automático", desc: "Integração direta com o Mercado Pago através da plataforma rifa.digital para baixa automática e segura.", icon: "💸" },
            { num: 3, title: "Sorteio ao vivo", desc: "Acompanhe o sorteio ao vivo e boa sorte!", icon: "🎁" },
          ].map((step, i) => (
            <div
              key={step.num}
              className="flex gap-3.5 items-start bg-panel/60 backdrop-blur-sm border border-white/[0.06] rounded-xl p-4 hover:border-gold-500/30 hover:bg-panel/80 transition-all duration-300 animate-fade-up group"
              style={{ animationDelay: `${0.55 + i * 0.12}s` }}
            >
              <div className="flex-none w-[32px] h-[32px] rounded-lg bg-gradient-to-br from-gold-300 to-gold-700 text-ink font-anton text-[14px] flex items-center justify-center shadow-md group-hover:scale-110 group-hover:shadow-[0_0_12px_rgba(228,185,78,0.4)] transition-all duration-300">
                {step.num}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[14px] group-hover:scale-110 transition-transform duration-300">{step.icon}</span>
                  <h3 className="font-anton text-[15px] text-cream font-bold tracking-[0.05em]">{step.title}</h3>
                </div>
                <p className="text-[12.5px] text-[#9fc2ab] leading-[1.5]">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center animate-fade-up" style={{ animationDelay: "0.9s" }}>
          <a
            href="https://chat.whatsapp.com/EYD5CmJ0Oer4aeM0zQ9mqu"
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleCTAClick}
            className="group relative block w-full bg-gradient-to-br from-green-light to-green text-cream font-anton text-[18px] tracking-[0.02em] uppercase no-underline py-4 rounded-xl border border-gold-500/40 shadow-[0_10px_30px_rgba(20,107,57,0.4)] hover:shadow-[0_10px_50px_rgba(20,107,57,0.7)] hover:scale-[1.03] transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            <span className="relative z-10">Entrar no grupo agora</span>
          </a>
          <div className="mt-3 flex items-center justify-center gap-4 text-[11px] text-[#7d9c88]">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-light animate-pulse" />
              Grupo gratuito
            </span>
            <span>·</span>
            <span>Sorteios automatizados</span>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-white/[0.06] text-center animate-fade-in" style={{ animationDelay: "1s" }}>
          <p className="text-[11px] text-[#7d9c88] leading-[1.6] px-4">
            Rifa informal entre amigos gerenciada via rifa.digital.
            <br />
            Processamento de pagamentos seguro integrado com Mercado Pago.
          </p>
          <div className="mt-3 flex items-center justify-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-gold-500/40" />
            <span className="text-[10px] text-[#7d9c88] tracking-wider uppercase">Rifa <span className="font-fifa">Legends</span> © 2026</span>
            <div className="w-1.5 h-1.5 rounded-full bg-gold-500/40" />
          </div>
        </div>
      </div>
      <Chatbot />
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <PageContent />
    </Suspense>
  );
}
