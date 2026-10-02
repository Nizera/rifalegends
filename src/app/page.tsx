"use client";

import { Suspense } from "react";
import { trackWhatsAppClick } from "@/components/FacebookPixel";
import PrizeCarousel from "@/components/PrizeCarousel";
import Chatbot from "@/components/Chatbot";
import LiveNotification from "@/components/LiveNotification";
import FAQSection from "@/components/FAQSection";

function PageContent() {
  const handleCTAClick = () => {
    trackWhatsAppClick();
  };

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-6 sm:py-10 relative overflow-hidden">
      {/* Background Gold & Green Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-radial from-green/20 via-gold-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-[480px] relative z-10">
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

        {/* Prêmios com Carrossel em Leque */}
        <div className="mb-5 animate-scale-in" style={{ animationDelay: "0.4s" }}>
          <PrizeCarousel />
        </div>

        {/* CTA 1 */}
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

        {/* Social Proof / Authority (Leilão + Instagram) */}
        <div className="mb-8 p-4 rounded-2xl bg-panel/70 backdrop-blur-md border border-gold-500/20 shadow-xl animate-fade-up" style={{ animationDelay: "0.55s" }}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-300 to-gold-700 flex items-center justify-center text-ink font-anton text-[18px]">
              👑
            </div>
            <div>
              <h3 className="font-anton text-[16px] text-cream tracking-wide">Comunidade de Sucesso</h3>
              <p className="text-[11px] text-gold-300 font-bold">+ de 400 membros ativos no grupo</p>
            </div>
          </div>
          <p className="text-[12px] text-[#9fc2ab] leading-relaxed mb-3">
            Evoluímos do nosso grupo de leilão de sucesso para as rifas oficiais! Acompanhe também nossos bastidores e novidades no Instagram:
          </p>
          <a
            href="https://www.instagram.com/oscarasdaslegends/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] text-cream text-[13px] font-bold transition-all"
          >
            <svg className="w-4 h-4 text-gold-300" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
            <span>@oscarasdaslegends no Instagram</span>
          </a>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-6 animate-fade-in" style={{ animationDelay: "0.6s" }}>
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
              style={{ animationDelay: `${0.65 + i * 0.12}s` }}
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

        {/* FAQ Section */}
        <FAQSection />

        {/* CTA 2 */}
        <div className="text-center animate-fade-up" style={{ animationDelay: "0.95s" }}>
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

      <LiveNotification />
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
