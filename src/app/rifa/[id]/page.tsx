"use client";

import { useEffect, useState, useRef, use } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

interface Message {
  id: string;
  user_id: string | null;
  conteudo: string;
  tipo: "texto" | "lance" | "sistema" | "llm";
  criado_em: string;
  user_nome?: string;
}

interface Lot {
  id: string;
  titulo: string;
  lance_inicial: number;
  incremento_minimo: number;
  arremate_imediato: number | null;
  status: string;
  vencedor_id: string | null;
  lance_vencedor: number | null;
  inicio: string | null;
  fim: string | null;
  duracao_segundos: number;
}

interface Session {
  id: string;
  titulo: string;
  status: string;
}

export default function RifaChatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { user, profile, loading: authLoading } = useAuth();
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [lots, setLots] = useState<Lot[]>([]);
  const [activeLot, setActiveLot] = useState<Lot | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [user, authLoading, router]);

  // Load session and lots
  useEffect(() => {
    if (!user) return;
    loadData();
  }, [user, id]);

  // Subscribe to new messages
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel(`chat-${id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `session_id=eq.${id}`,
        },
        async (payload) => {
          const msg = payload.new as Message;
          let nome = "Sistema";
          if (msg.user_id) {
            const { data } = await supabase
              .from("users")
              .select("nome")
              .eq("id", msg.user_id)
              .single();
            nome = data?.nome || "Anônimo";
          }
          setMessages((prev) => [
            ...prev,
            { ...msg, user_nome: nome },
          ]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, id]);

  // Subscribe to lot updates
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel(`lots-${id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "lots",
          filter: `session_id=eq.${id}`,
        },
        (payload) => {
          const updated = payload.new as Lot;
          setLots((prev) =>
            prev.map((l) => (l.id === updated.id ? updated : l))
          );
          if (activeLot?.id === updated.id) {
            setActiveLot(updated);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, id, activeLot]);

  // Timer
  useEffect(() => {
    if (!activeLot?.inicio || activeLot.status !== "ao_vivo") {
      setTimeLeft(null);
      return;
    }

    const interval = setInterval(() => {
      const inicioMs = new Date(activeLot.inicio!).getTime();
      const now = Date.now();
      const elapsed = Math.floor((now - inicioMs) / 1000);
      const remaining = Math.max(0, activeLot.duracao_segundos - elapsed);
      setTimeLeft(remaining);

      if (remaining === 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [activeLot]);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function callAuctioneer(params: {
    event: "lot_start" | "bid_placed" | "timer_warning" | "lot_end" | "arremate" | "extend_timer";
    lotTitle?: string;
    lotInitialBid?: number;
    currentBid?: number;
    currentBidder?: string;
    timeLeft?: number;
    increment?: number;
  }) {
    try {
      const res = await fetch("/api/auctioneer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });
      const data = await res.json();
      if (data.reply) {
        await supabase.from("messages").insert({
          session_id: id,
          user_id: null,
          conteudo: data.reply,
          tipo: "llm",
        });
      }
    } catch {}
  }

  // Announce lot when it goes live
  useEffect(() => {
    if (activeLot?.status === "ao_vivo" && !activeLot.lance_vencedor) {
      callAuctioneer({
        event: "lot_start",
        lotTitle: activeLot.titulo,
        lotInitialBid: activeLot.lance_inicial,
      });
    }
  }, [activeLot?.id, activeLot?.status]);

  // Timer warnings and lot end
  useEffect(() => {
    if (timeLeft === null || !activeLot) return;
    if (activeLot.status !== "ao_vivo") return;

    if (timeLeft === 60 || timeLeft === 30 || timeLeft === 10 || timeLeft === 5) {
      callAuctioneer({
        event: "timer_warning",
        lotTitle: activeLot.titulo,
        currentBid: activeLot.lance_vencedor || activeLot.lance_inicial,
        currentBidder: "o participante",
        timeLeft,
      });
    }

    if (timeLeft === 0 && activeLot.vencedor_id) {
      callAuctioneer({
        event: "lot_end",
        lotTitle: activeLot.titulo,
        currentBid: activeLot.lance_vencedor ?? undefined,
        currentBidder: "o vencedor",
      });
    }
  }, [timeLeft, activeLot?.id]);

  async function loadData() {
    const { data: sess } = await supabase
      .from("auction_sessions")
      .select("*")
      .eq("id", id)
      .single();
    setSession(sess);

    const { data: lotsData } = await supabase
      .from("lots")
      .select("*")
      .eq("session_id", id)
      .order("criado_em", { ascending: true });
    setLots(lotsData || []);

    const activeLotData = lotsData?.find((l) => l.status === "ao_vivo");
    if (activeLotData) setActiveLot(activeLotData);
    else if (lotsData?.length) setActiveLot(lotsData[0]);

    // Load messages
    const { data: msgs } = await supabase
      .from("messages")
      .select("*")
      .eq("session_id", id)
      .order("criado_em", { ascending: true });

    if (msgs) {
      const enriched = await Promise.all(
        msgs.map(async (m) => {
          let nome = "Sistema";
          if (m.user_id) {
            const { data } = await supabase
              .from("users")
              .select("nome")
              .eq("id", m.user_id)
              .single();
            nome = data?.nome || "Anônimo";
          }
          return { ...m, user_nome: nome };
        })
      );
      setMessages(enriched);
    }

    setLoading(false);
  }

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || sending || !user) return;

    setInput("");
    setSending(true);

    // Check if it's a bid
    const bidValue = Number(text.replace(/[^\d.,]/g, "").replace(",", "."));
    const isBid = !isNaN(bidValue) && bidValue > 0 && activeLot?.status === "ao_vivo";

    if (isBid) {
      // Validate bid
      const minBid = activeLot.lance_vencedor
        ? activeLot.lance_vencedor + activeLot.incremento_minimo
        : activeLot.lance_inicial;

      if (bidValue < minBid) {
        await supabase.from("messages").insert({
          session_id: id,
          user_id: user.id,
          conteudo: `R$${bidValue} — Lance mínimo: R$${minBid}`,
          tipo: "sistema",
        });
        setSending(false);
        return;
      }

      // Check for duplicate
      if (bidValue === activeLot.lance_vencedor) {
        setSending(false);
        return;
      }

      // Insert bid
      const { error } = await supabase.from("bids").insert({
        lot_id: activeLot.id,
        user_id: user.id,
        valor: bidValue,
      });

      if (error) {
        setSending(false);
        return;
      }

      // Update lot
      await supabase
        .from("lots")
        .update({
          lance_vencedor: bidValue,
          vencedor_id: user.id,
        })
        .eq("id", activeLot.id);

      // Extend timer if in last minute
      if (timeLeft !== null && timeLeft <= 60) {
        const newInicio = new Date(
          Date.now() - (activeLot.duracao_segundos - 60) * 1000
        ).toISOString();
        await supabase
          .from("lots")
          .update({ inicio: newInicio })
          .eq("id", activeLot.id);

        // Call auctioneer to announce extension
        callAuctioneer({
          event: "extend_timer",
          lotTitle: activeLot.titulo,
          currentBid: bidValue,
          currentBidder: profile?.nome || "Participante",
        });
      }

      // Send bid message
      await supabase.from("messages").insert({
        session_id: id,
        user_id: user.id,
        conteudo: `${bidValue}`,
        tipo: "lance",
      });

      // Call auctioneer to acknowledge bid
      callAuctioneer({
        event: "bid_placed",
        lotTitle: activeLot.titulo,
        currentBid: bidValue,
        currentBidder: profile?.nome || "Participante",
        increment: activeLot.incremento_minimo,
      });
    } else {
      // Regular message
      await supabase.from("messages").insert({
        session_id: id,
        user_id: user.id,
        conteudo: text,
        tipo: "texto",
      });
    }

    setSending(false);
  }

  function formatTime(seconds: number) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  if (authLoading || !user || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold-300 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-panel/80 backdrop-blur-sm border-b border-white/[0.08] px-4 py-3">
        <div className="max-w-[700px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-[#7d9c88] hover:text-cream transition-colors"
            >
              ←
            </Link>
            <div>
              <h1 className="text-[14px] text-cream font-bold">
                {session?.titulo}
              </h1>
              <p className="text-[11px] text-[#7d9c88]">
                {profile?.nome}
              </p>
            </div>
          </div>
          {timeLeft !== null && activeLot?.status === "ao_vivo" && (
            <div
              className={`text-[16px] font-mono font-bold px-3 py-1.5 rounded-lg ${
                timeLeft <= 30
                  ? "bg-red-500/20 text-red-300 animate-pulse"
                  : timeLeft <= 60
                  ? "bg-yellow-500/20 text-yellow-300"
                  : "bg-green-500/20 text-green-300"
              }`}
            >
              {formatTime(timeLeft)}
            </div>
          )}
        </div>
      </div>

      {/* Lot selector */}
      {lots.length > 1 && (
        <div className="bg-panel/40 border-b border-white/[0.06] px-4 py-2 overflow-x-auto">
          <div className="max-w-[700px] mx-auto flex gap-2">
            {lots.map((lot) => (
              <button
                key={lot.id}
                onClick={() => setActiveLot(lot)}
                  className={`flex-none px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all ${
                  activeLot?.id === lot.id
                    ? "bg-gold/20 text-gold-300 border border-gold/30"
                    : "bg-white/[0.04] text-[#7d9c88] hover:text-cream border border-transparent"
                }`}
              >
                {lot.titulo}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Active Lot Info */}
      {activeLot && (
        <div className="bg-panel/30 border-b border-white/[0.06] px-4 py-3">
          <div className="max-w-[700px] mx-auto">
            <div className="flex items-center gap-4 text-[12px]">
              <span className="text-gold-300 font-bold">
                {activeLot.titulo}
              </span>
              <span className="text-[#9fc2ab]">
                Lance: R${activeLot.lance_inicial}
              </span>
              <span className="text-[#9fc2ab]">
                Inc: R${activeLot.incremento_minimo}
              </span>
              {activeLot.arremate_imediato && (
                <span className="text-green-light font-bold">
                  Imediato: R${activeLot.arremate_imediato}
                </span>
              )}
              {activeLot.lance_vencedor && (
                <span className="text-gold-300 font-bold">
                  Atual: R${activeLot.lance_vencedor}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="max-w-[700px] mx-auto space-y-3">
          {messages.length === 0 && (
            <div className="text-center py-10">
              <p className="text-[#7d9c88] text-[14px]">
                Aguardando início da rifa...
              </p>
            </div>
          )}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`${
                msg.tipo === "sistema" || msg.tipo === "llm"
                  ? "text-center"
                  : msg.user_id === user?.id
                  ? "flex justify-end"
                  : "flex justify-start"
              }`}
            >
              {msg.tipo === "sistema" || msg.tipo === "llm" ? (
                <div className="bg-gold/10 text-gold-300 text-[12px] px-3 py-2 rounded-xl inline-block max-w-[85%]">
                  {msg.conteudo}
                </div>
              ) : msg.tipo === "lance" ? (
                <div
                  className={`${
                    msg.user_id === user?.id
                      ? "bg-green-light/20 border border-green-light/30"
                      : "bg-white/[0.06] border border-white/[0.08]"
                  } px-4 py-2.5 rounded-xl`}
                >
                  <p className="text-[11px] text-[#7d9c88] mb-0.5">
                    {msg.user_nome}
                  </p>
                  <p className="text-[18px] text-cream font-bold font-mono">
                    R${msg.conteudo}
                  </p>
                </div>
              ) : (
                <div
                  className={`${
                    msg.user_id === user?.id
                      ? "bg-green-light/20 rounded-br-sm"
                      : "bg-white/[0.06] rounded-bl-sm"
                  } px-3 py-2 rounded-xl max-w-[80%]`}
                >
                  {msg.user_id !== user?.id && (
                    <p className="text-[11px] text-gold-300 font-bold mb-0.5">
                      {msg.user_nome}
                    </p>
                  )}
                  <p className="text-[13px] text-cream/90">{msg.conteudo}</p>
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-white/[0.08] px-4 py-3 bg-panel/60 backdrop-blur-sm">
        <form
          onSubmit={sendMessage}
          className="max-w-[700px] mx-auto flex gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              activeLot?.status === "ao_vivo"
                ? "Digite seu lance (ex: 80) ou mensagem..."
                : "Aguardando rifa..."
            }
            disabled={activeLot?.status !== "ao_vivo" || sending}
            className="flex-1 bg-deep border border-white/[0.08] rounded-xl px-4 py-3 text-[14px] text-cream placeholder-[#6a9078] outline-none focus:border-gold/50 disabled:opacity-50 transition-colors"
            autoFocus
          />
          <button
            type="submit"
            disabled={!input.trim() || sending || activeLot?.status !== "ao_vivo"}
            className="w-12 h-12 bg-gradient-to-br from-green-light to-green rounded-xl flex items-center justify-center text-cream hover:scale-105 transition-all disabled:opacity-30 disabled:hover:scale-100"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </form>
        {activeLot?.arremate_imediato && activeLot.status === "ao_vivo" && !activeLot.lance_vencedor && (
          <button
            onClick={async () => {
              if (!user || sending) return;
              setSending(true);
              const { error } = await supabase.from("bids").insert({
                lot_id: activeLot.id,
                user_id: user.id,
                valor: activeLot.arremate_imediato!,
              });
              if (!error) {
                await supabase
                  .from("lots")
                  .update({
                    lance_vencedor: activeLot.arremate_imediato,
                    vencedor_id: user.id,
                    status: "finalizado",
                  })
                  .eq("id", activeLot.id);
                await supabase.from("messages").insert({
                  session_id: id,
                  user_id: user.id,
                  conteudo: `${activeLot.arremate_imediato}`,
                  tipo: "lance",
                });
                callAuctioneer({
                  event: "arremate",
                  lotTitle: activeLot.titulo,
                  currentBid: activeLot.arremate_imediato ?? undefined,
                  currentBidder: profile?.nome || "Participante",
                });
              }
              setSending(false);
            }}
            disabled={sending}
            className="max-w-[700px] mx-auto mt-2 w-full bg-gradient-to-r from-gold-300/20 to-gold-300/10 border border-gold-300/30 rounded-xl px-4 py-2.5 text-gold-300 font-bold text-[13px] hover:from-gold-300/30 hover:to-gold-300/20 transition-all disabled:opacity-40"
          >
            ⚡ ARREMATE IMEDIATO — R${activeLot.arremate_imediato}
          </button>
        )}
      </div>
    </div>
  );
}
