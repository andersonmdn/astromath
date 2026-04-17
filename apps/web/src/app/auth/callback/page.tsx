import { Suspense } from "react";
import { AuthCallbackClient } from "./AuthCallbackClient";

function LoadingFallback() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-950 text-white">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-400">Autenticando...</p>
      </div>
    </main>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <AuthCallbackClient />
    </Suspense>
  );
}