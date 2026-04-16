import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

interface RankingEntry {
  name: string;
  wins: number;
  matches: number;
}

interface MatchEntry {
  id: string;
  startedAt: string;
  finishedAt: string | null;
  player1: { name: string };
  player2: { name: string };
  winner: { name: string } | null;
}

async function getRanking(): Promise<RankingEntry[]> {
  try {
    const res = await fetch(`${API_URL}/ranking`, { next: { revalidate: 10 } });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

async function getMatches(): Promise<MatchEntry[]> {
  try {
    const res = await fetch(`${API_URL}/matches?limit=10`, { next: { revalidate: 10 } });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function RankingPage() {
  const [ranking, matches] = await Promise.all([getRanking(), getMatches()]);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
    <main className="max-w-2xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">AstroMath</p>
          <h1 className="text-2xl font-bold">Ranking</h1>
        </div>
        <Link href="/" className="text-sm font-medium text-indigo-400 hover:text-indigo-200 transition-colors">
          ← Jogar
        </Link>
      </div>

      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-3 text-indigo-400">Ranking</h2>
        {ranking.length === 0 ? (
          <p className="text-gray-500 text-sm">Nenhuma partida registrada ainda.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 border-b border-gray-800 text-left">
                <th className="py-2 w-8">#</th>
                <th className="py-2">Jogador</th>
                <th className="py-2 text-right">Vitórias</th>
                <th className="py-2 text-right">Partidas</th>
              </tr>
            </thead>
            <tbody>
              {ranking.map((entry, i) => (
                <tr key={entry.name} className="border-b border-gray-900">
                  <td className="py-2 text-gray-500">{i + 1}</td>
                  <td className="py-2 font-medium">{entry.name}</td>
                  <td className="py-2 text-right text-yellow-400">{entry.wins}</td>
                  <td className="py-2 text-right text-gray-400">{entry.matches}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3 text-indigo-400">Partidas Recentes</h2>
        {matches.length === 0 ? (
          <p className="text-gray-500 text-sm">Nenhuma partida registrada ainda.</p>
        ) : (
          <ul className="space-y-2">
            {matches.map((m) => (
              <li key={m.id} className="rounded bg-gray-900 px-4 py-3 text-sm flex items-center justify-between">
                <span>
                  <span className="font-semibold">{m.player1.name}</span>
                  <span className="text-gray-500 mx-1">vs</span>
                  <span className="font-semibold">{m.player2.name}</span>
                </span>
                <span className="text-right">
                  {m.winner && (
                    <span className="text-yellow-400 text-xs mr-2">{m.winner.name} venceu</span>
                  )}
                  <span className="text-gray-600 text-xs">
                    {m.finishedAt
                      ? new Date(m.finishedAt).toLocaleDateString("pt-BR")
                      : "em andamento"}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
    </div>
  );
}
