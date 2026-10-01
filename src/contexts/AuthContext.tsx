"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

interface Profile {
  id: string;
  nome: string;
  telefone: string;
  is_admin: boolean;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (telefone: string, senha: string) => Promise<{ error?: string }>;
  signUp: (data: {
    nome: string;
    telefone: string;
    senha: string;
    cpf?: string;
    email?: string;
  }) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) loadProfile(session.user.id);
      else setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) loadProfile(session.user.id);
        else {
          setProfile(null);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  async function loadProfile(userId: string) {
    const { data } = await supabase
      .from("users")
      .select("id, nome, telefone, is_admin")
      .eq("id", userId)
      .single();
    setProfile(data);
    setLoading(false);
  }

  async function signIn(telefone: string, senha: string) {
    const cleanTel = telefone.replace(/\D/g, "");
    const email = `legends-${cleanTel}@app.rifalegends.com`;
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });
    if (error) return { error: "Telefone ou senha inválidos" };
    return {};
  }

  async function signUp(data: {
    nome: string;
    telefone: string;
    senha: string;
    cpf?: string;
    email?: string;
  }) {
    const cleanTel = data.telefone.replace(/\D/g, "");
    const authEmail = data.email || `legends-${cleanTel}@app.rifalegends.com`;

    const { error: authError } = await supabase.auth.signUp({
      email: authEmail,
      password: data.senha,
      options: {
        data: {
          nome: data.nome,
          telefone: data.telefone,
        },
      },
    });
    if (authError) return { error: authError.message };

    const {
      data: { user: newUser },
    } = await supabase.auth.getUser();
    if (!newUser) return { error: "Erro ao criar conta" };

    const { error: profileError } = await supabase.from("users").insert({
      id: newUser.id,
      nome: data.nome,
      telefone: data.telefone,
      cpf: data.cpf,
      email: data.email,
    });
    if (profileError) return { error: "Erro ao salvar perfil" };

    return {};
  }

  async function signOut() {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  }

  return (
    <AuthContext.Provider
      value={{ user, profile, loading, signIn, signUp, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
