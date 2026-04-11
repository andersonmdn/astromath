/**
 * Validation script for Etapa 3.
 * Requires the game-server to be running: pnpm --filter @astromath/game-server dev
 *
 * Run: pnpm --filter @astromath/game-server validate
 */

import { Client } from "colyseus.js";

const SERVER = "ws://localhost:2567";
const PASS = (msg: string) => console.log(`  ✓ ${msg}`);
const FAIL = (msg: string) => { console.error(`  ✗ ${msg}`); process.exit(1); };

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function run() {
  console.log("\n=== AstroMath Etapa 3 — Validation ===\n");

  const clientA = new Client(SERVER);
  const clientB = new Client(SERVER);

  // ── Step 1: Alice creates a room ────────────────────────────────────────────
  console.log("[1] Alice creates room...");
  const roomA = await clientA.create("game", { name: "Alice" }).catch((e) => {
    FAIL(`Could not create room: ${e.message}`);
    throw e;
  });
  PASS(`Room created — id: ${roomA.id}`);

  await sleep(200);

  // ── Step 2: Bob joins by roomId ──────────────────────────────────────────────
  console.log("[2] Bob joins by roomId...");
  const roomB = await clientB.joinById(roomA.id, { name: "Bob" }).catch((e) => {
    FAIL(`Could not join room: ${e.message}`);
    throw e;
  });
  PASS("Bob joined successfully");

  await sleep(200);

  // ── Step 3: Validate state — 2 players, none ready ──────────────────────────
  console.log("[3] Checking initial state...");
  const players = Object.keys(roomA.state.players.toJSON?.() ?? roomA.state.players);
  if (players.length !== 2) FAIL(`Expected 2 players, got ${players.length}`);
  PASS("2 players connected");

  // ── Step 4: Both send ready ──────────────────────────────────────────────────
  console.log("[4] Both players send ready...");

  let gameStartedA = false;
  let gameStartedB = false;

  roomA.onMessage("game_start", (data: { firstTurn: string }) => {
    gameStartedA = true;
    PASS(`Alice received game_start — firstTurn: ${data.firstTurn}`);
  });

  roomB.onMessage("game_start", (data: { firstTurn: string }) => {
    gameStartedB = true;
    PASS(`Bob received game_start — firstTurn: ${data.firstTurn}`);
  });

  roomA.send("ready");
  await sleep(100);
  roomB.send("ready");

  await sleep(500);

  // ── Step 5: Validate game started ───────────────────────────────────────────
  console.log("[5] Validating game started...");
  if (!gameStartedA) FAIL("Alice did not receive game_start");
  if (!gameStartedB) FAIL("Bob did not receive game_start");

  const status = (roomA.state as { status: string }).status;
  if (status !== "playing") FAIL(`Expected status "playing", got "${status}"`);
  PASS(`Room status is "playing"`);

  const currentTurn = (roomA.state as { currentTurn: string }).currentTurn;
  if (!currentTurn) FAIL("currentTurn is empty");
  PASS(`currentTurn assigned: ${currentTurn}`);

  // ── Cleanup ──────────────────────────────────────────────────────────────────
  await roomA.leave();
  await roomB.leave();

  console.log("\n=== All checks passed ✓ ===\n");
  process.exit(0);
}

run().catch((err) => {
  console.error("\nUnexpected error:", err);
  process.exit(1);
});
