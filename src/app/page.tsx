"use client";

import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import { socket } from "~/socket";
import type { Game } from "~/lib/game";

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");
  const [gameCode, setGameCode] = useState("");
  const [game, setGame] = useState<Game | null>(null);

  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);

      socket.io.engine.on("upgrade", (transport) => {
        setTransport(transport.name);
      });
    }

    function onDisconnect() {
      setIsConnected(false);
      setTransport("N/A");
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("receiveGame", (data: Game) => {
      setGame(data);
    });

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("joinedGame");
    };
  }, []);

  const handleJoinGame = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (gameCode.length === 4) {
      socket.emit("joinGame", gameCode);
    }
  };

  const handleGameCodeChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (parseInt(event.target.value, 10)) {
      setGameCode(event.target.value);
    }
  };

  return (
    <div>
      <h1>Joined Game: {game?.roomCode}</h1>
      {!game && (
        <form onSubmit={handleJoinGame}>
          <input
            name="gameCode"
            value={gameCode}
            onChange={handleGameCodeChange}
          />
          <button type="submit">Join Game</button>
        </form>
      )}
      {game && (
        <div>
          <div>Players:</div>
          {game.players.map((player) => {
            if (player.id === socket.id) {
              return (
                <b key={player.id}>
                  <p>{player.nickname}</p>
                </b>
              );
            }
            return <p key={player.id}>{player.nickname}</p>;
          })}
        </div>
      )}
    </div>
  );
}
