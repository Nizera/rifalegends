"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

interface Session {
  id: string;
  data: string;
  titulo: string;
  status: string;
  lots_count?: number;
}

export default function AdminPage() {
  const { profile, loading: authLoading, signOut } = useAuth();
  const router = useRouter();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (!authLoading && !profile) router.push("/login");
    if (!authLoading && profile && !profile.is_admin) router.push("/");
  }, [profile, authLoading, router]);

  useEffect(() => {
    if (profile?.is_admin) loadSessions();
  }, [profile]);

  async function loadSessions() {
    const { data } = await supabase
      .from("auction_sessions")
      .select("*")
      .order("criado_em", { ascending: false });

    if (data) {
      const withCount = await Promise.all(
        data.map(async (s) => {
          const { count } = await supabase
            .from("lots")
            .select("*", { count: "exact", head: true })
            .eq("session_id", s.id);
          return { ...s, lots_count: count || 0 };
        })
      );
      setSessions(withCount);
    }
    setLoading(false);
  }

  async function createSession(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setCreating(true);

    const { data, error } = await supabase
      .from("auction_sessions")
      .insert({ titulo: newTitle.trim() })
      .select()
      .single();

    if (!error && data) {
      setSessions((prev) => [{ ...data, lots_count: 0 }, ...prev]);
      setNewTitle("");
      setShowNew(false);
    }
    setCreating(false);
  }

  async function startSession(id: string) {
    await supabase
      .from("auction_sessions")
      .update({ status: "ao_vivo" })
      .eq("id", id);
    loadSessions();
  }

  async function endSession(id: string) {
    await supabase
      .from("auction_sessions")
      .update({ status: "encerrada" })
      .eq("id", id);
    loadSessions();
  }

  if (authLoading || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold-300 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    preparando: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
    ao_vivo: "bg-green-500/20 text-green-300 border-green-500/30",
    encerrada: "bg-white/10 text-[#7d9c88] border-white/10",
  };

  return (
    <div className="min-h-screen px-4 py-6 sm:py-10">
      <div className="max-w-[700px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-fifa text-[24px] text-gold-300">
              Painel <span className="font-anton">Admin</span>
            </h1>
            <p className="text-[12px] text-[#7d9c88]">
              Olá, {profile.nome}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/arremates"
              className="text-[12px] text-gold-300 hover:text-gold-700 transition-colors"
            >
              Arremates
            </Link>
            <button
              onClick={signOut}
              className="text-[12px] text-[#7d9c88] hover:text-cream transition-colors"
            >
              Sair
            </button>
          </div>
        </div>

        {/* New Session */}
        <div className="mb-6">
          {!showNew ? (
            <button
              onClick={() => setShowNew(true)}
              className="w-full py-3 rounded-xl border-2 border-dashed border-gold-500/30 text-gold-300 text-[14px] font-bold hover:border-gold-500/60 hover:bg-panel/40 transition-all"
            >
              + Nova Sessão de Rifa
            </button>
          ) : (
            <form
              onSubmit={createSession}
              className="bg-panel/60 border border-white/[0.08] rounded-xl p-4"
            >
              <label className="block text-[12px] text-[#7d9c88] mb-1.5 uppercase tracking-wider">
                Título da sessão
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ex: Rifa 20/08 - Noite"
                  className="flex-1 bg-deep border border-white/[0.08] rounded-lg px-3 py-2.5 text-[14px] text-cream placeholder-[#6a9078] outline-none focus:border-gold/50"
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={creating}
                  className="px-4 py-2.5 bg-gradient-to-br from-gold-300 to-gold-700 text-ink font-bold text-[13px] rounded-lg hover:scale-105 transition-transform disabled:opacity-50"
                >
                  {creating ? "..." : "Criar"}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowNew(false); setNewTitle(""); }}
                  className="px-3 py-2.5 text-[#7d9c88] hover:text-cream text-[13px] transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Sessions List */}
        {loading ? (
          <div className="text-center py-10 text-[#7d9c88]">Carregando...</div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-[#7d9c88] text-[14px]">Nenhuma sessão ainda</p>
            <p className="text-[#7d9c88] text-[12px] mt-1">
              Crie uma nova sessão para começar
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {sessions.map((s) => (
              <div
                key={s.id}
                className="bg-panel/60 border border-white/[0.08] rounded-xl p-4 hover:border-gold-500/20 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-[15px] text-cream font-bold">
                      {s.titulo}
                    </h3>
                    <p className="text-[12px] text-[#7d9c88]">
                      {new Date(s.data).toLocaleDateString("pt-BR")} ·{" "}
                      {s.lots_count} lote{s.lots_count !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <span
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${
                      statusColors[s.status] || statusColors.preparando
                    }`}
                  >
                    {s.status === "preparando"
                      ? "Preparando"
                      : s.status === "ao_vivo"
                      ? "AO VIVO"
                      : "Encerrada"}
                  </span>
                </div>

                <div className="flex gap-2">
                  <Link
                    href={`/admin/rifa/${s.id}`}
                    className="flex-1 text-center py-2 bg-white/[0.06] hover:bg-white/[0.1] rounded-lg text-[13px] text-cream transition-colors"
                  >
                    Configurar
                  </Link>
                  <Link
                    href={`/rifa/${s.id}`}
                    className="flex-1 text-center py-2 bg-white/[0.06] hover:bg-white/[0.1] rounded-lg text-[13px] text-cream transition-colors"
                  >
                    Chat
                  </Link>
                  {s.status === "preparando" && (
                    <button
                      onClick={() => startSession(s.id)}
                      className="px-4 py-2 bg-green-light/20 hover:bg-green-light/30 text-green-light rounded-lg text-[13px] font-bold transition-colors"
                    >
                      Iniciar
                    </button>
                  )}
                  {s.status === "ao_vivo" && (
                    <button
                      onClick={() => endSession(s.id)}
                      className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg text-[13px] font-bold transition-colors"
                    >
                      Encerrar
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
