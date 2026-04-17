"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/contexts/SessionContext";
import { getGithubAuthUrl } from "@/lib/api-client";

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

        <div className="flex items-center gap-2 text-gray-600">
          <hr className="flex-1 border-gray-700" />
          <span className="text-xs">ou</span>
          <hr className="flex-1 border-gray-700" />
        </div>

        <a
          href={getGithubAuthUrl()}
          className="flex items-center justify-center gap-2 w-full rounded border border-gray-600 py-2 font-semibold text-gray-300 hover:bg-gray-800 transition-colors"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z" />
          </svg>
          Entrar com GitHub
        </a>
      </div>
    </main>
  );
}
