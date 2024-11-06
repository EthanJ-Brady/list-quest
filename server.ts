import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import type { Socket } from "socket.io";
import type { Game } from "~/lib/game";
import { fetchGame } from "~/lib/game";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

const games: Game[] = [];

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
        sendGame(socket, game);
      });

      socket.on("setMessage", (message: string) => {
        const rooms = Array.from(socket.rooms);
        console.log(rooms);
        if (!rooms[1]) return;
        const game = fetchGame(games, rooms[1]);
        game.message = message;
        sendGame(socket, game);
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
