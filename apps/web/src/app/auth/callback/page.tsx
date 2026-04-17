"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "@/contexts/SessionContext";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { saveSession, player: currentPlayer } = useSession();
  const handled = useRef(false);
  const [linked, setLinked] = useState<string | null>(null);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    const token = searchParams.get("token");
    const error = searchParams.get("error");

    if (error || !token) {
      router.replace("/login");
      return;
    }

    const wasLoggedIn = !!currentPlayer;

    saveSession(token)
      .then(() => {
        // If user was already logged in before → it's a linking flow
        // After saveSession, player state will update — detect via re-render
        if (wasLoggedIn) {
          setLinked("vinculado");
          setTimeout(() => router.replace("/"), 2000);
        } else {
          router.replace("/");
        }
      })
      .catch(() => router.replace("/login"));
  }, [searchParams, router, saveSession, currentPlayer]);

  if (linked) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-950 text-white">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="text-green-400 text-2xl">✓</div>
          <p className="text-white font-semibold">GitHub conectado com sucesso!</p>
          <p className="text-gray-400 text-sm">Redirecionando...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-950 text-white">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-400">Autenticando...</p>
      </div>
    </main>
  );
}
