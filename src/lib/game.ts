export type Game = {
  code: string;
  message: string;
};

export function fetchGame(games: Game[], code: string) {
  let game = games.find((game) => game.code === code);
  if (game) {
    return game;
  }
  game = {
    code: code,
    message: "",
  };
  games.push(game);
  return game;
}
