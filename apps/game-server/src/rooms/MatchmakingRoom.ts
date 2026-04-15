import { Room, Client, matchMaker } from "colyseus";

interface JoinOptions {
  name?: string;
  mode?: string;
}

type QueueEntry = { client: Client; name: string };

export class MatchmakingRoom extends Room {
  maxClients = 100;
  autoDispose = false;

  private queues = new Map<string, QueueEntry[]>();

  onJoin(client: Client, options: JoinOptions = {}) {
    const name = options.name?.trim() || `Player`;
    const mode = options.mode === "math" ? "math" : options.mode === "easy" ? "easy" : "classic";

    (client as unknown as Record<string, unknown>)._matchOptions = { name, mode };

    if (!this.queues.has(mode)) this.queues.set(mode, []);
    this.queues.get(mode)!.push({ client, name });

    this.log(`${name} entrou na fila (modo: ${mode}, tamanho: ${this.queues.get(mode)!.length})`);
    this.tryMatch(mode);
  }

  onLeave(client: Client) {
    const opts = (client as unknown as Record<string, { name: string; mode: string }>)._matchOptions;
    const mode = opts?.mode ?? "classic";
    const queue = this.queues.get(mode);
    if (!queue) return;
    const idx = queue.findIndex((e) => e.client.sessionId === client.sessionId);
    if (idx !== -1) {
      const [removed] = queue.splice(idx, 1);
      this.log(`${removed.name} saiu da fila (modo: ${mode})`);
    }
  }

  onDispose() {
    this.log("sala de matchmaking destruída");
  }

  private async tryMatch(mode: string) {
    const queue = this.queues.get(mode)!;
    if (queue.length < 2) return;

    const [p1, p2] = queue.splice(0, 2);
    this.log(`pareando ${p1.name} vs ${p2.name} (modo: ${mode})`);

    try {
      const room = await matchMaker.createRoom("game", { mode });
      p1.client.send("match_found", { roomId: room.roomId });
      p2.client.send("match_found", { roomId: room.roomId });
      this.log(`sala ${room.roomId} criada para ${p1.name} vs ${p2.name}`);
    } catch (e) {
      this.log(`erro ao criar sala: ${e}`);
      queue.unshift(p1, p2);
    }
  }

  private log(msg: string) {
    console.log(`[${new Date().toISOString()}][matchmaking] ${msg}`);
  }
}
