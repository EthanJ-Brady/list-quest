import generateNickname from "~/util/nicknameGenerator";

export type Player = {
  id: string;
  nickname: string;
};

export function fetchPlayer(players: Player[], socketId: string) {
  let player = players.find((player) => player.id === socketId);
  if (player) {
    return player;
  }
  player = {
    id: socketId,
    nickname: generateNickname(),
  };
  players.push(player);
  return player;
}
