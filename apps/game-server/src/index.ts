import { Server } from "colyseus";
import { createServer } from "http";
import { GameRoom } from "./rooms/GameRoom.js";

const PORT = Number(process.env.PORT) || 2567;

const httpServer = createServer((req, res) => {
  if (req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "ok", service: "game-server" }));
    return;
  }
  res.writeHead(404);
  res.end();
});

const gameServer = new Server({ server: httpServer });

gameServer.define("game", GameRoom);

gameServer.listen(PORT).then(() => {
  console.log(`Game server running on http://localhost:${PORT}`);
  console.log(`WebSocket: ws://localhost:${PORT}`);
});
