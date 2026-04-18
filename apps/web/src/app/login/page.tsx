"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/contexts/SessionContext";

type Tab = "login" | "register";

export default function LoginPage() {
  const router = useRouter();
  const { player, isLoading, login, register } = useSession();
  const [tab, setTab] = useState<Tab>("login");
  const [nickname, setNickname] = useState("");
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && player) router.replace("/");
  }, [isLoading, player, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (tab === "register") {
      if (pin !== confirmPin) {
        setError("Os PINs não conferem.");
        return;
      }
    }

    setSubmitting(true);
    try {
      if (tab === "login") {
        await login(nickname.trim(), pin);
      } else {
        await register(nickname.trim(), pin);
      }
      router.replace("/");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro inesperado.");
    } finally {
      setSubmitting(false);
    }
  }

  if (isLoading) return null;

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-950 text-white p-4">
      <div className="w-full max-w-sm space-y-6">
        <h1 className="text-3xl font-bold tracking-tight text-center">AstroMath</h1>

        {/* Tabs */}
        <div className="flex rounded overflow-hidden border border-gray-700">
          <button
            type="button"
            onClick={() => { setTab("login"); setError(""); }}
            className={`flex-1 py-2 text-sm font-semibold transition-colors ${
              tab === "login" ? "bg-indigo-700 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
          >
            Entrar
          </button>
          <button
            type="button"
            onClick={() => { setTab("register"); setError(""); }}
            className={`flex-1 py-2 text-sm font-semibold transition-colors ${
              tab === "register" ? "bg-indigo-700 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
          >
            Criar conta
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Nickname</label>
            {tab === "register" && (
              <p className="text-xs text-gray-600 mb-1">3–20 caracteres: letras, números, _</p>
            )}
            <input
              className="w-full rounded bg-gray-800 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Seu nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              maxLength={20}
              required
              disabled={submitting}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">PIN</label>
            {tab === "register" && (
              <p className="text-xs text-gray-600 mb-1">Mínimo 4 dígitos numéricos</p>
            )}
            <input
              type="password"
              inputMode="numeric"
              className="w-full rounded bg-gray-800 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="••••"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              required
              disabled={submitting}
            />
          </div>

          {tab === "register" && (
            <div>
              <label className="block text-sm text-gray-400 mb-1">Confirmar PIN</label>
              <input
                type="password"
                inputMode="numeric"
                className="w-full rounded bg-gray-800 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="••••"
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value)}
                required
                disabled={submitting}
              />
            </div>
          )}

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded bg-indigo-600 py-2 font-semibold hover:bg-indigo-500 disabled:opacity-50 transition-colors"
          >
            {submitting ? "Aguarde..." : tab === "login" ? "Entrar" : "Criar conta"}
          </button>
        </form>

        {/* GitHub login temporarily disabled */}
      </div>
    </main>
  );
}
