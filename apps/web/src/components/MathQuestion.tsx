"use client";

import { useState, useEffect, useRef } from "react";

interface MathQuestionProps {
  question: string;
  onAnswer: (correct: boolean) => void;
}

export function MathQuestion({ question, onAnswer }: MathQuestionProps) {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const value = Number(input.trim());
    if (isNaN(value) || input.trim() === "") return;
    onAnswer(value === getAnswer(question));
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="rounded-xl bg-gray-900 border border-indigo-700 p-6 w-full max-w-xs text-center space-y-4">
        <p className="text-xs text-indigo-400 uppercase tracking-wide font-semibold">
          Modo Matemática
        </p>
        <p className="text-gray-300 text-sm">Responda para disparar:</p>
        <p className="text-3xl font-bold text-white">{question} = ?</p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            ref={inputRef}
            type="number"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full rounded bg-gray-800 px-3 py-2 text-center text-white text-xl outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Sua resposta"
          />
          <button
            type="submit"
            disabled={input.trim() === ""}
            className="w-full rounded bg-indigo-600 py-2 font-semibold text-white hover:bg-indigo-500 disabled:opacity-40 transition-colors"
          >
            Confirmar
          </button>
        </form>
      </div>
    </div>
  );
}

/** Parse the numeric answer from a question string like "3 + 4" */
function getAnswer(question: string): number {
  const match = question.match(/^(\d+)\s*([+\-*])\s*(\d+)$/);
  if (!match) return NaN;
  const [, a, op, b] = match;
  const na = Number(a), nb = Number(b);
  if (op === "+") return na + nb;
  if (op === "-") return na - nb;
  if (op === "*") return na * nb;
  return NaN;
}
