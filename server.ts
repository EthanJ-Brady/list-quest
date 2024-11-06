import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import type { Socket } from "socket.io";
import type { Game } from "~/lib/game";
import type { Player } from "~/lib/player";
import { fetchGame } from "~/lib/game";
import { fetchPlayer } from "~/lib/player";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

const games: Game[] = [];
const players: Player[] = [];

const playerRooms = new Map<string, string>();

function sendGame(socket: Socket, game: Game) {
  socket.emit("receiveGame", game);
  socket.to(game.code).emit("receiveGame", game);
}

app
  .prepare()
  .then(() => {
    const httpServer = createServer((req, res) => {
      handler(req, res).catch((err) => {
        console.error("Error handling request", err);
        res.statusCode = 500;
        res.end("Internal Server Error");
      });
    });

    const io = new Server(httpServer);

    io.on("connection", (socket) => {
      socket.on("joinGame", async (room: string) => {
        await socket.join(room);
        const game = fetchGame(games, room);
        const player = fetchPlayer(players, socket.id);
        game.players.push(player);

        playerRooms.set(socket.id, room);

        sendGame(socket, game);
      });

      socket.on("setMessage", (message: string) => {
        const room = playerRooms.get(socket.id);
        if (!room) return;

        const game = fetchGame(games, room);
        game.message = message;
        sendGame(socket, game);
      });

      socket.on("disconnect", () => {
        const room = playerRooms.get(socket.id);
        if (!room) return;

        const game = fetchGame(games, room);
        const playerIndex = game.players.findIndex((p) => p.id === socket.id);

        if (playerIndex !== -1) {
          game.players.splice(playerIndex, 1);
          playerRooms.delete(socket.id);
          sendGame(socket, game);
        }
      });
    });

    httpServer
      .once("error", (err) => {
        console.error(err);
        process.exit(1);
      })
      .listen(port, () => {
        console.log(`> Ready on http://${hostname}:${port}`);
      });
  })
  .catch((err: Error) => {
    console.log(err);
  });
