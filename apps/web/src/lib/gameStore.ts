import type { Room } from "@colyseus/sdk";
import type { Board } from "@astromath/shared";

// Module-level store — persists during client-side navigation
let _room: Room | null = null;
let _nickname = "";
let _myBoard: Board | null = null;

export const gameStore = {
  setRoom(room: Room) {
    _room = room;
  },
  getRoom(): Room | null {
    return _room;
  },
  clearRoom() {
    _room = null;
  },
  setNickname(n: string) {
    _nickname = n;
  },
  getNickname(): string {
    return _nickname;
  },
  setMyBoard(board: Board) {
    _myBoard = board;
  },
  getMyBoard(): Board | null {
    return _myBoard;
  },
  clearMyBoard() {
    _myBoard = null;
  },
};
