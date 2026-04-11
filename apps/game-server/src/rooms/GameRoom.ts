import { Room, Client } from "colyseus";
import { GameRoomState, PlayerState } from "../schema/GameRoomState.js";
import { createBoard, placeShip, registerBoard, fireAt, isAllSunk } from "@astromath/shared";
import type { Board, ShipType, Orientation, CellCoord } from "@astromath/shared";

interface CreateOptions {
  mode?: string;
}

interface JoinOptions {
  name?: string;
}

interface PlacementEntry {
  shipId: string;
  type: ShipType;
  sector: number;
  ring: number;
  orientation: Orientation;
}

interface SubmitBoardPayload {
  placements: PlacementEntry[];
}

const RECONNECTION_TIMEOUT = Number(process.env.RECONNECTION_TIMEOUT ?? 30);

export class GameRoom extends Room<GameRoomState> {
  maxClients = 2;
  private playerBoards = new Map<string, Board>();

  onCreate(options: CreateOptions = {}) {
    this.setState(new GameRoomState());
    this.state.mode = options.mode === "math" ? "math" : "classic";
    this.log(`sala criada — modo: ${this.state.mode}`);

    this.onMessage("ready", (client: Client) => {
      if (this.state.phase !== "lobby") return;
      const player = this.state.players.get(client.sessionId);
      if (!player) return;
      player.isReady = !player.isReady;
      this.log(`${player.name} ready=${player.isReady}`);
      this.tryStartPlacement();
    });

    this.onMessage("submit_board", (client: Client, data: SubmitBoardPayload) => {
      if (this.state.phase !== "placement") return;
      if (!data?.placements?.length) {
        this.sendError(client, "INVALID_PLACEMENT", "Nenhum posicionamento enviado.");
        return;
      }

      let board = createBoard();
      for (const p of data.placements) {
        const origin: CellCoord = { sector: p.sector, ring: p.ring };
        const result = placeShip(board, origin, p.type, p.orientation, p.shipId);
        if (!result) {
          this.sendError(client, "INVALID_PLACEMENT", "Posicionamento inválido.");
          return;
        }
        board = result;
      }

      if (!registerBoard(board)) {
        this.sendError(client, "INCOMPLETE_FLEET", "Frota incompleta.");
        return;
      }

      this.playerBoards.set(client.sessionId, board);
      const player = this.state.players.get(client.sessionId);
      if (player) player.boardReady = true;

      this.log(`${player?.name} confirmou o board`);
      this.tryStartBattle();
    });

    this.onMessage("fire", (client: Client, data: { sector: number; ring: number }) => {
      if (this.state.phase !== "battle") {
        this.sendError(client, "INVALID_PHASE", "Não é fase de batalha.");
        return;
      }
      if (this.state.currentTurn !== client.sessionId) {
        this.sendError(client, "NOT_YOUR_TURN", "Não é sua vez.");
        return;
      }

      const opponentId = Array.from(this.state.players.keys()).find(
        (id) => id !== client.sessionId
      );
      if (!opponentId) return;

      const opponentBoard = this.playerBoards.get(opponentId);
      if (!opponentBoard) return;

      const coord: CellCoord = { sector: data.sector, ring: data.ring };
      const fired = fireAt(opponentBoard, coord);
      if (!fired) {
        this.sendError(client, "INVALID_TARGET", "Alvo inválido ou já atingido.");
        return;
      }

      this.playerBoards.set(opponentId, fired.board);

      this.broadcast("shot_result", {
        shooterId: client.sessionId,
        coord,
        result: fired.result,
      });

      if (isAllSunk(fired.board)) {
        this.state.phase = "finished";
        this.state.winner = client.sessionId;
        this.broadcast("game_over", { winner: client.sessionId });
        const allPlayers = Array.from(this.state.players.values());
        const winnerName = this.state.players.get(client.sessionId)?.name;
        this.log(`fim de jogo — vencedor: ${winnerName}`);
        this.saveMatch(
          allPlayers[0]?.name ?? "",
          allPlayers[1]?.name ?? "",
          winnerName
        );
        return;
      }

      this.state.currentTurn = opponentId;
    });

    this.onMessage("cancel_board", (client: Client) => {
      if (this.state.phase !== "placement") return;
      const player = this.state.players.get(client.sessionId);
      if (player) player.boardReady = false;
      this.playerBoards.delete(client.sessionId);
    });

    // Math mode: wrong answer causes the current player to lose their turn
    this.onMessage("skip_turn", (client: Client) => {
      if (this.state.phase !== "battle") return;
      if (this.state.currentTurn !== client.sessionId) return;
      const opponentId = Array.from(this.state.players.keys()).find(
        (id) => id !== client.sessionId
      );
      if (!opponentId) return;
      this.state.currentTurn = opponentId;
      const name = this.state.players.get(client.sessionId)?.name;
      this.log(`${name} errou a pergunta — vez passou para adversário`);
    });
  }

  onJoin(client: Client, options: JoinOptions = {}) {
    const player = new PlayerState();
    player.id = client.sessionId;
    player.name = options.name?.trim() || `Player ${this.state.players.size + 1}`;
    this.state.players.set(client.sessionId, player);
    this.log(`${player.name} entrou (${this.state.players.size}/2)`);
  }

  async onLeave(client: Client, consented: boolean) {
    const player = this.state.players.get(client.sessionId);
    const playerName = player?.name ?? client.sessionId;
    const phase = this.state.phase;

    if (consented || phase === "lobby" || phase === "finished") {
      this.log(`${playerName} saiu (consented=${consented}, phase=${phase})`);
      this.removePlayer(client);
      return;
    }

    this.log(`${playerName} desconectou — aguardando reconexão (${RECONNECTION_TIMEOUT}s)`);

    try {
      await this.allowReconnection(client, RECONNECTION_TIMEOUT);
      this.log(`${playerName} reconectou`);
    } catch {
      this.log(`${playerName} abandonou (timeout ${RECONNECTION_TIMEOUT}s)`);
      this.broadcast("opponent_abandoned", {
        sessionId: client.sessionId,
        name: playerName,
      });
      this.removePlayer(client);
    }
  }

  onDispose() {
    this.log("sala destruída");
  }

  private removePlayer(client: Client) {
    this.state.players.delete(client.sessionId);
    this.playerBoards.delete(client.sessionId);

    if (this.state.phase !== "lobby") {
      this.state.phase = "lobby";
      this.state.winner = "";
      this.broadcast("player_left", { sessionId: client.sessionId });
    }
  }

  private tryStartPlacement() {
    const players = Array.from(this.state.players.values());
    if (players.length !== 2 || !players.every((p) => p.isReady)) return;
    this.state.phase = "placement";
    this.log("fase de posicionamento iniciada");
    this.broadcast("placement_start", {});
  }

  private tryStartBattle() {
    const players = Array.from(this.state.players.values());
    if (!players.every((p) => p.boardReady)) return;
    const ids = Array.from(this.state.players.keys());
    this.state.currentTurn = ids[Math.floor(Math.random() * 2)];
    this.state.phase = "battle";
    const turnName = this.state.players.get(this.state.currentTurn)?.name;
    this.log(`batalha iniciada — vez de: ${turnName}`);
    this.broadcast("battle_ready", { firstTurn: this.state.currentTurn });
  }

  private sendError(client: Client, code: string, message: string) {
    client.send("error", { code, message });
    this.log(`erro enviado para ${client.sessionId}: [${code}] ${message}`);
  }

  private saveMatch(player1Name: string, player2Name: string, winnerName?: string) {
    const apiUrl = process.env.API_URL ?? "http://localhost:3001";
    fetch(`${apiUrl}/matches`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roomId: this.roomId, player1Name, player2Name, winnerName }),
    }).catch((e: unknown) => this.log(`falha ao salvar partida: ${e}`));
  }

  private log(msg: string) {
    const phase = this.state?.phase ?? "?";
    console.log(`[${new Date().toISOString()}][${this.roomId}][${phase}] ${msg}`);
  }
}
