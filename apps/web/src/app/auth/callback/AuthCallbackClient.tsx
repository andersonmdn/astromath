"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "@/contexts/SessionContext";

export function AuthCallbackClient() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { saveSession, player: currentPlayer } = useSession();
    const handledToken = useRef<string | null>(null);
    const [linked, setLinked] = useState<string | null>(null);
    
    useEffect(() => {
        const token = searchParams.get("token");
        const error = searchParams.get("error");
        
        if (handledToken.current === token) return;
        handledToken.current = token;
        
        if (error || !token) {
            router.replace("/login");
            return;
        }
        
        const wasLoggedIn = !!currentPlayer;
        
        saveSession(token)
        .then(() => {
            if (wasLoggedIn) {
                setLinked("vinculado");
                setTimeout(() => router.replace("/"), 2000);
                return;
            }
            
            router.replace("/");
        })
        .catch(() => router.replace("/login"));
    }, [searchParams, router, saveSession, currentPlayer]);
    
    if (linked) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-gray-950 text-white">
            <div className="flex flex-col items-center gap-3 text-center">
            <div className="text-green-400 text-2xl">✓</div>
            <p className="font-semibold text-white">GitHub conectado com sucesso!</p>
            <p className="text-sm text-gray-400">Redirecionando...</p>
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