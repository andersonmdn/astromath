import { Room, Client } from "colyseus";

export class LobbyRoom extends Room {
  onCreate() {
    console.log("LobbyRoom created");
  }

  onJoin(client: Client) {
    console.log(`${client.sessionId} joined lobby`);
  }

  onLeave(client: Client) {
    console.log(`${client.sessionId} left lobby`);
  }

  onDispose() {
    console.log("LobbyRoom disposed");
  }
}
