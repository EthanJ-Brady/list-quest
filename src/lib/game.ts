import type { Player } from "./player";

export type Game = {
  roomCode: string;
  message: string;
  players: Player[];
};

export function fetchGame(games: Game[], roomCode: string) {
  let game = games.find((game) => game.roomCode === roomCode);
  if (game) {
    return game;
  }
  game = {
    roomCode: roomCode,
    message: "",
    players: [],
  };
  games.push(game);
  return game;
}
