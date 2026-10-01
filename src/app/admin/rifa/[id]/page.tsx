"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

interface Lot {
  id: string;
  titulo: string;
  descricao: string;
  fotos: string[];
  lance_inicial: number;
  incremento_minimo: number;
  arremate_imediato: number | null;
  status: string;
  vencedor_id: string | null;
  lance_vencedor: number | null;
}

interface Session {
  id: string;
  titulo: string;
  status: string;
  data: string;
}

export default function AdminRifaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { profile, loading: authLoading } = useAuth();
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [lots, setLots] = useState<Lot[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [creating, setCreating] = useState(false);

  // New lot form
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [lanceInicial, setLanceInicial] = useState("");
  const [incremento, setIncremento] = useState("5");
  const [arremateImediato, setArremateImediato] = useState("");
  const [fotos, setFotos] = useState<string[]>([]);

  useEffect(() => {
    if (!authLoading && !profile) router.push("/login");
    if (!authLoading && profile && !profile.is_admin) router.push("/");
  }, [profile, authLoading, router]);

  useEffect(() => {
    if (profile?.is_admin) loadData();
  }, [profile, id]);

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
    setLoading(false);
  }

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;

    for (const file of Array.from(files)) {
      const fileName = `${id}/${Date.now()}-${file.name}`;
      const { data } = await supabase.storage
        .from("lot-photos")
        .upload(fileName, file);

      if (data) {
        const {
          data: { publicUrl },
        } = supabase.storage.from("lot-photos").getPublicUrl(data.path);
        setFotos((prev) => [...prev, publicUrl]);
      }
    }
  }

  async function createLot(e: React.FormEvent) {
    e.preventDefault();
    if (!titulo.trim() || !lanceInicial) return;
    setCreating(true);

    const { error } = await supabase.from("lots").insert({
      session_id: id,
      titulo: titulo.trim(),
      descricao: descricao.trim() || null,
      lance_inicial: Number(lanceInicial),
      incremento_minimo: Number(incremento) || 5,
      arremate_imediato: arremateImediato ? Number(arremateImediato) : null,
      fotos,
    });

    if (!error) {
      setTitulo("");
      setDescricao("");
      setLanceInicial("");
      setIncremento("5");
      setArremateImediato("");
      setFotos([]);
      setShowNew(false);
      loadData();
    }
    setCreating(false);
  }

  async function deleteLot(lotId: string) {
    if (!confirm("Excluir este lote?")) return;
    await supabase.from("lots").delete().eq("id", lotId);
    loadData();
  }

  if (authLoading || !profile || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold-300 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-6 sm:py-10">
      <div className="max-w-[700px] mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link
            href="/admin"
            className="text-[#7d9c88] hover:text-cream transition-colors"
          >
            ← Voltar
          </Link>
        </div>

        <div className="mb-6">
          <h1 className="font-fifa text-[22px] text-gold-300">
            {session?.titulo}
          </h1>
          <p className="text-[12px] text-[#7d9c88]">
            {session?.data
              ? new Date(session.data).toLocaleDateString("pt-BR")
              : ""}{" "}
            · {lots.length} lote{lots.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Add Lot Button */}
        {session?.status === "preparando" && (
          <div className="mb-6">
            {!showNew ? (
              <button
                onClick={() => setShowNew(true)}
                className="w-full py-3 rounded-xl border-2 border-dashed border-gold-500/30 text-gold-300 text-[14px] font-bold hover:border-gold-500/60 hover:bg-panel/40 transition-all"
              >
                + Adicionar Lote
              </button>
            ) : (
              <form
                onSubmit={createLot}
                className="bg-panel/60 border border-white/[0.08] rounded-xl p-4 space-y-3"
              >
                <div>
                  <label className="block text-[12px] text-[#7d9c88] mb-1.5 uppercase tracking-wider">
                    Título do lote *
                  </label>
                  <input
                    type="text"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    placeholder="Ex: Trio de Bronze"
                    required
                    className="w-full bg-deep border border-white/[0.08] rounded-lg px-3 py-2.5 text-[14px] text-cream placeholder-[#6a9078] outline-none focus:border-gold/50"
                  />
                </div>
                <div>
                  <label className="block text-[12px] text-[#7d9c88] mb-1.5 uppercase tracking-wider">
                    Descrição
                  </label>
                  <textarea
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    placeholder="Descrição do lote..."
                    rows={2}
                    className="w-full bg-deep border border-white/[0.08] rounded-lg px-3 py-2.5 text-[14px] text-cream placeholder-[#6a9078] outline-none focus:border-gold/50 resize-none"
                  />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[12px] text-[#7d9c88] mb-1.5 uppercase tracking-wider">
                      Lance inicial *
                    </label>
                    <input
                      type="number"
                      value={lanceInicial}
                      onChange={(e) => setLanceInicial(e.target.value)}
                      placeholder="70"
                      required
                      min="1"
                      className="w-full bg-deep border border-white/[0.08] rounded-lg px-3 py-2.5 text-[14px] text-cream placeholder-[#6a9078] outline-none focus:border-gold/50"
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] text-[#7d9c88] mb-1.5 uppercase tracking-wider">
                      Incremento
                    </label>
                    <input
                      type="number"
                      value={incremento}
                      onChange={(e) => setIncremento(e.target.value)}
                      placeholder="5"
                      min="1"
                      className="w-full bg-deep border border-white/[0.08] rounded-lg px-3 py-2.5 text-[14px] text-cream placeholder-[#6a9078] outline-none focus:border-gold/50"
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] text-[#7d9c88] mb-1.5 uppercase tracking-wider">
                      Arremate Imediato
                    </label>
                    <input
                      type="number"
                      value={arremateImediato}
                      onChange={(e) => setArremateImediato(e.target.value)}
                      placeholder="150"
                      min="1"
                      className="w-full bg-deep border border-white/[0.08] rounded-lg px-3 py-2.5 text-[14px] text-cream placeholder-[#6a9078] outline-none focus:border-gold/50"
                    />
                  </div>
                </div>

                {/* Photos */}
                <div>
                  <label className="block text-[12px] text-[#7d9c88] mb-1.5 uppercase tracking-wider">
                    Fotos
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoUpload}
                    className="w-full text-[12px] text-[#7d9c88] file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-[12px] file:font-bold file:bg-gold/20 file:text-gold-300 hover:file:bg-gold/30 file:cursor-pointer"
                  />
                  {fotos.length > 0 && (
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {fotos.map((url, i) => (
                        <div key={i} className="relative">
                          <img
                            src={url}
                            alt=""
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setFotos((prev) => prev.filter((_, j) => j !== i))
                            }
                            className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    disabled={creating}
                    className="flex-1 py-2.5 bg-gradient-to-br from-gold-300 to-gold-700 text-ink font-bold text-[13px] rounded-lg hover:scale-[1.02] transition-all disabled:opacity-50"
                  >
                    {creating ? "Criando..." : "Adicionar Lote"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowNew(false);
                      setFotos([]);
                    }}
                    className="px-4 py-2.5 text-[#7d9c88] hover:text-cream text-[13px] transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Lots List */}
        {lots.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-[#7d9c88] text-[14px]">Nenhum lote ainda</p>
          </div>
        ) : (
          <div className="space-y-3">
            {lots.map((lot) => (
              <div
                key={lot.id}
                className="bg-panel/60 border border-white/[0.08] rounded-xl p-4"
              >
                <div className="flex items-start gap-3">
                  {lot.fotos?.[0] && (
                    <img
                      src={lot.fotos[0]}
                      alt=""
                      className="w-16 h-16 object-cover rounded-lg flex-none"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[14px] text-cream font-bold truncate">
                      {lot.titulo}
                    </h3>
                    {lot.descricao && (
                      <p className="text-[12px] text-[#7d9c88] truncate">
                        {lot.descricao}
                      </p>
                    )}
                    <div className="flex gap-3 mt-1.5 text-[11px] text-[#9fc2ab]">
                      <span>Lance: R${lot.lance_inicial}</span>
                      <span>Inc: R${lot.incremento_minimo}</span>
                      {lot.arremate_imediato && (
                        <span>Imediato: R${lot.arremate_imediato}</span>
                      )}
                    </div>
                    {lot.vencedor_id && (
                      <div className="mt-1.5 text-[12px] text-green-light font-bold">
                        🏆 Vencedor: R${lot.lance_vencedor}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full text-center font-bold ${
                        lot.status === "ao_vivo"
                          ? "bg-green-500/20 text-green-300"
                          : lot.status === "encerrado"
                          ? "bg-white/10 text-[#7d9c88]"
                          : "bg-yellow-500/20 text-yellow-300"
                      }`}
                    >
                      {lot.status === "ao_vivo"
                        ? "AO VIVO"
                        : lot.status === "encerrado"
                        ? "Encerrado"
                        : "Aguardando"}
                    </span>
                    {session?.status === "preparando" && (
                      <button
                        onClick={() => deleteLot(lot.id)}
                        className="text-[10px] text-red-400 hover:text-red-300 mt-1"
                      >
                        Excluir
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
