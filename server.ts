import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

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
      // ...
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
  .catch((err) => {
    console.log(err);
  });
