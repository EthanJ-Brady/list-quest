import type { Player } from "./player";

export type Game = {
  code: string;
  message: string;
  players: Player[];
};

export function fetchGame(games: Game[], code: string) {
  let game = games.find((game) => game.code === code);
  if (game) {
    return game;
  }
  game = {
    code: code,
    message: "",
    players: [],
  };
  games.push(game);
  return game;
}
