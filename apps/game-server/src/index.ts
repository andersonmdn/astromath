import "dotenv/config";
import { Server } from "colyseus";
import { WebSocketTransport } from "@colyseus/ws-transport";
import { createServer } from "http";
import { GameRoom } from "./rooms/GameRoom.js";
import { MatchmakingRoom } from "./rooms/MatchmakingRoom.js";

const PORT = Number(process.env.PORT) || 2567;

const httpServer = createServer((req, res) => {
  if (req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "ok", service: "game-server" }));
  }
});

const gameServer = new Server({
  transport: new WebSocketTransport({ server: httpServer }),
});

gameServer.define("game", GameRoom);
gameServer.define("matchmaking", MatchmakingRoom);

gameServer.listen(PORT).then(() => {
  console.log(`Game server running on http://localhost:${PORT}`);
  console.log(`WebSocket: ws://localhost:${PORT}`);
});
