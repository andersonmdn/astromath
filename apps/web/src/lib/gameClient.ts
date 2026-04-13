import { Client } from "@colyseus/sdk";

const GAME_SERVER_URL =
  process.env.NEXT_PUBLIC_GAME_SERVER_URL ?? "ws://localhost:2567";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const gameClient: Client =
  typeof window !== "undefined"
    ? new Client(GAME_SERVER_URL)
    : (null as unknown as Client);
