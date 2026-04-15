"use client";

import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Level = "simple" | "complete";

interface SlideData {
  icon: string;
  title: string;
  content: Record<Level, React.ReactNode>;
}

interface TutorialModalProps {
  open: boolean;
  onClose: () => void;
}

// ─── Shared sub-components ────────────────────────────────────────────────────

const SHIPS = [
  { color: "#0891b2", label: "Patrulha",       size: 1, qty: 5, orient: "Em linha ou Em curva",  warn: false },
  { color: "#ea580c", label: "Reconhecimento", size: 2, qty: 2, orient: "Em linha ou Em curva",  warn: false },
  { color: "#7c3aed", label: "Multifunção",    size: 3, qty: 1, orient: "Em linha ou Em curva",  warn: false },
  { color: "#15803d", label: "Combate",        size: 4, qty: 1, orient: "Somente Em curva ⚠️", warn: true  },
] as const;

function FleetTable() {
  return (
    <table className="w-full border-collapse">
      <thead>
        <tr className="text-xs text-gray-500 text-left">
          <th className="pb-1 font-normal">Nave</th>
          <th className="pb-1 font-normal text-center">Casas</th>
          <th className="pb-1 font-normal text-center">Qtd</th>
          <th className="pb-1 font-normal">Orientação</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-800">
        {SHIPS.map((s) => (
          <tr key={s.label}>
            <td className="py-1.5 flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm shrink-0 inline-block" style={{ backgroundColor: s.color }} />
              {s.label}
            </td>
            <td className="py-1.5 text-center">{s.size}</td>
            <td className="py-1.5 text-center">{s.qty}</td>
            <td className={`py-1.5 text-xs ${s.warn ? "text-yellow-400" : "text-gray-400"}`}>
              {s.orient}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function ShipColorList() {
  return (
    <ul className="space-y-2 ml-2 text-sm">
      {SHIPS.map((s) => (
        <li key={s.label} className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-sm shrink-0" style={{ backgroundColor: s.color }} />
          <span>{s.label} — {s.size} {s.size === 1 ? "casa" : "casas"}</span>
        </li>
      ))}
    </ul>
  );
}

// ─── Slides ───────────────────────────────────────────────────────────────────

const SLIDES: SlideData[] = [
  {
    icon: "🚀",
    title: "Bem-vindo ao AstroMath!",
    content: {
      simple: (
        <p className="text-gray-300 leading-relaxed">
          Dois jogadores. Cada um posiciona suas naves num tabuleiro circular e tenta afundar a frota do adversário.
          O primeiro a afundar <strong className="text-white">todas as naves inimigas</strong> vence.
        </p>
      ),
      complete: (
        <p className="text-gray-300 leading-relaxed">
          Um jogo <strong className="text-white">inspirado em batalha naval</strong>, ambientado no
          espaço, para 2 jogadores. Cada jogador posiciona sua frota num tabuleiro circular e tenta
          afundar as naves do adversário. Quem afundar toda a frota inimiga primeiro{" "}
          <strong className="text-white">vence</strong>!
        </p>
      ),
    },
  },
  {
    icon: "🎯",
    title: "O Tabuleiro Radial",
    content: {
      simple: (
        <div className="space-y-3 text-gray-300 leading-relaxed">
          <p>
            O tabuleiro é um círculo dividido em{" "}
            <strong className="text-white">setores</strong> e{" "}
            <strong className="text-white">anéis</strong>.
          </p>
          <ul className="space-y-2 ml-2">
            <li className="flex gap-2">
              <span className="text-indigo-400 font-bold shrink-0">Setor</span>
              <span>— qual fatia do círculo (como as horas de um relógio)</span>
            </li>
            <li className="flex gap-2">
              <span className="text-indigo-400 font-bold shrink-0">Anel</span>
              <span>— o quão perto ou longe do centro está a casa (1 = centro, 6 = borda)</span>
            </li>
          </ul>
        </div>
      ),
      complete: (
        <div className="space-y-3 text-gray-300 leading-relaxed">
          <p>O campo de batalha é uma grade circular. Cada célula é definida por duas coordenadas:</p>
          <ul className="space-y-2 ml-2">
            <li className="flex gap-2">
              <span className="text-indigo-400 font-bold shrink-0">Setor</span>
              <span>— a posição angular (fatia do círculo, como horas num relógio)</span>
            </li>
            <li className="flex gap-2">
              <span className="text-indigo-400 font-bold shrink-0">Anel</span>
              <span>— a distância do centro (1 = mais interno, 6 = borda externa)</span>
            </li>
          </ul>
          <p className="text-sm text-gray-500">
            Pense como um radar: setores são os ângulos, anéis são os raios.
          </p>
        </div>
      ),
    },
  },
  {
    icon: "🛸",
    title: "Sua Frota",
    content: {
      simple: (
        <div className="space-y-3 text-sm text-gray-300">
          <p>São <strong className="text-white">9 naves</strong> no total. Cada tipo ocupa um número diferente de casas:</p>
          <FleetTable />
          <p className="text-xs text-yellow-400/80">
            ⚠️ A nave Combate só pode ser colocada em curva — é a única com essa restrição.
          </p>
        </div>
      ),
      complete: (
        <div className="space-y-3 text-sm text-gray-300">
          <p>Você deve posicionar <strong className="text-white">9 naves</strong> antes da batalha:</p>
          <FleetTable />
          <p className="text-xs text-yellow-400/80">
            ⚠️ A nave Combate só pode ser posicionada Em curva.
          </p>
        </div>
      ),
    },
  },
  {
    icon: "📍",
    title: "Posicione sua Frota",
    content: {
      simple: (
        <ol className="space-y-2 text-gray-300 leading-relaxed list-none">
          <li className="flex gap-3">
            <span className="text-indigo-400 font-bold shrink-0">1.</span>
            <span>Escolha uma nave no painel lateral</span>
          </li>
          <li className="flex gap-3">
            <span className="text-indigo-400 font-bold shrink-0">2.</span>
            <div>
              Escolha como ela vai se encaixar:
              <ul className="mt-1 ml-2 space-y-1 text-sm">
                <li><span className="text-white font-semibold">↑ Em linha</span> — aponta do centro para fora</li>
                <li><span className="text-white font-semibold">↻ Em curva</span> — segue o arco do tabuleiro</li>
              </ul>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="text-indigo-400 font-bold shrink-0">3.</span>
            <span>Clique numa casa do tabuleiro para posicionar</span>
          </li>
          <li className="flex gap-3">
            <span className="text-indigo-400 font-bold shrink-0">4.</span>
            <span>Repita até posicionar todas — depois confirme o tabuleiro</span>
          </li>
        </ol>
      ),
      complete: (
        <ol className="space-y-2 text-gray-300 leading-relaxed list-none">
          <li className="flex gap-3">
            <span className="text-indigo-400 font-bold shrink-0">1.</span>
            <span>Selecione uma nave no painel lateral</span>
          </li>
          <li className="flex gap-3">
            <span className="text-indigo-400 font-bold shrink-0">2.</span>
            <div>
              Escolha a orientação:
              <ul className="mt-1 ml-2 space-y-1 text-sm">
                <li><span className="text-white font-semibold">↑ Em linha</span> — a nave se estende do centro para fora</li>
                <li><span className="text-white font-semibold">↻ Em curva</span> — a nave se estende em arco</li>
              </ul>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="text-indigo-400 font-bold shrink-0">3.</span>
            <span>Clique em uma célula do tabuleiro para posicionar</span>
          </li>
          <li className="flex gap-3">
            <span className="text-indigo-400 font-bold shrink-0">4.</span>
            <span>Posicione <strong className="text-white">todas as naves</strong> e confirme o tabuleiro para iniciar a batalha</span>
          </li>
        </ol>
      ),
    },
  },
  {
    icon: "💥",
    title: "Fase de Batalha",
    content: {
      simple: (
        <div className="space-y-3 text-gray-300 leading-relaxed">
          <p>Na <strong className="text-white">sua vez</strong>, clique em uma casa do tabuleiro do adversário para atirar:</p>
          <ul className="space-y-2 ml-2">
            <li className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-sm bg-red-600 shrink-0 inline-block" />
              <span>Acertou uma nave</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-sm bg-gray-500 shrink-0 inline-block" />
              <span>Água — não tinha nada aqui</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-sm bg-red-900 shrink-0 inline-block" />
              <span>Nave afundada — todas as casas foram atingidas</span>
            </li>
          </ul>
          <p className="text-sm text-gray-400">Afunde todas as naves para vencer.</p>
        </div>
      ),
      complete: (
        <div className="space-y-3 text-gray-300 leading-relaxed">
          <p>
            Na <strong className="text-white">sua vez</strong>, clique em uma célula do tabuleiro
            do adversário para atirar. Os resultados são:
          </p>
          <ul className="space-y-2 ml-2">
            <li className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-sm bg-red-600 shrink-0 inline-block" />
              <span><strong className="text-white">Vermelho</strong> — acertou uma nave!</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-sm bg-gray-500 shrink-0 inline-block" />
              <span><strong className="text-white">Cinza</strong> — água, errou</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-sm bg-red-900 shrink-0 inline-block" />
              <span><strong className="text-white">Vermelho escuro</strong> — nave afundada!</span>
            </li>
          </ul>
          <p className="text-sm text-gray-400">
            Afunde toda a frota adversária para vencer. Boa sorte, comandante!
          </p>
        </div>
      ),
    },
  },
  {
    icon: "⭐",
    title: "Modo Fácil",
    content: {
      simple: (
        <div className="space-y-3 text-gray-300 leading-relaxed">
          <p>
            Ao acertar uma nave, o tabuleiro mostra a{" "}
            <strong className="text-white">cor daquele tipo de nave</strong>.
            Quando ela é afundada, a cor fica mais escura.
          </p>
          <ShipColorList />
        </div>
      ),
      complete: (
        <div className="space-y-3 text-gray-300 leading-relaxed">
          <p>
            No modo <strong className="text-white">Fácil</strong>, ao acertar uma nave o tabuleiro
            revela a <strong className="text-white">cor daquela nave</strong>.
          </p>
          <ShipColorList />
          <p className="text-xs text-gray-400">
            Células afundadas ficam com a cor mais escura. Saber o tipo da nave indica quantas casas restam para afundá-la.
          </p>
        </div>
      ),
    },
  },
  {
    icon: "➗",
    title: "Modo Matemática",
    content: {
      simple: (
        <div className="space-y-3 text-gray-300 leading-relaxed">
          <p>Uma conta aparece antes de cada tiro:</p>
          <ul className="space-y-2 ml-2">
            <li className="flex gap-2">
              <span className="text-green-400 font-bold shrink-0">✓ Acertou</span>
              <span>— o tiro é disparado</span>
            </li>
            <li className="flex gap-2">
              <span className="text-red-400 font-bold shrink-0">✗ Errou</span>
              <span>— perde a vez</span>
            </li>
          </ul>
        </div>
      ),
      complete: (
        <div className="space-y-3 text-gray-300 leading-relaxed">
          <p>
            No modo <strong className="text-white">Matemática</strong>, antes de cada disparo uma
            conta aparece na tela.
          </p>
          <ul className="space-y-2 ml-2">
            <li className="flex gap-2">
              <span className="text-green-400 font-bold shrink-0">✓ Acertou</span>
              <span>— o tiro é disparado normalmente</span>
            </li>
            <li className="flex gap-2">
              <span className="text-red-400 font-bold shrink-0">✗ Errou</span>
              <span>— perde a vez, o turno passa para o oponente</span>
            </li>
          </ul>
          <p className="text-sm text-gray-400">
            Ative o modo Matemática na tela inicial antes de criar a sala.
          </p>
        </div>
      ),
    },
  },
];

// ─── Modal ────────────────────────────────────────────────────────────────────

export function TutorialModal({ open, onClose }: TutorialModalProps) {
  const [step, setStep] = useState(0);
  const [level, setLevel] = useState<Level>("simple");

  if (!open) return null;

  const isFirst = step === 0;
  const isLast = step === SLIDES.length - 1;
  const slide = SLIDES[step];

  function handleClose() {
    setStep(0);
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-md bg-gray-900 rounded-xl border border-gray-700 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
              Como Jogar
            </span>
            {/* Level selector */}
            <div className="flex rounded border border-gray-700 overflow-hidden text-xs">
              {(["simple", "complete"] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setLevel(l)}
                  className={`px-2.5 py-1 transition-colors ${
                    level === l
                      ? "bg-gray-700 text-white"
                      : "text-gray-500 hover:text-gray-300"
                  }`}
                >
                  {l === "simple" ? "Simples" : "Completa"}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-300 transition-colors text-lg leading-none"
            aria-label="Fechar tutorial"
          >
            ✕
          </button>
        </div>

        {/* Slide content */}
        <div className="px-6 pb-6 min-h-[220px]">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">{slide.icon}</span>
            <h2 className="text-lg font-bold text-white">{slide.title}</h2>
          </div>
          <div className="text-sm">{slide.content[level]}</div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-800">
          {/* Dots */}
          <div className="flex gap-1.5">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setStep(i)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === step ? "bg-indigo-500" : "bg-gray-700 hover:bg-gray-600"
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>

          {/* Navigation */}
          <div className="flex gap-2">
            {!isFirst && (
              <button
                onClick={() => setStep((s) => s - 1)}
                className="px-4 py-1.5 rounded border border-gray-700 text-sm text-gray-400 hover:bg-gray-800 transition-colors"
              >
                Anterior
              </button>
            )}
            {isLast ? (
              <button
                onClick={handleClose}
                className="px-4 py-1.5 rounded bg-indigo-600 hover:bg-indigo-500 text-sm font-semibold text-white transition-colors"
              >
                Começar!
              </button>
            ) : (
              <button
                onClick={() => setStep((s) => s + 1)}
                className="px-4 py-1.5 rounded bg-indigo-600 hover:bg-indigo-500 text-sm font-semibold text-white transition-colors"
              >
                Próximo
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
