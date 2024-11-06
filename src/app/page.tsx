"use client";

import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import { socket } from "../socket";

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");
  const [gameCode, setGameCode] = useState("");
  const [joinedGameCode, setJoinedGameCode] = useState("");

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
    socket.on("joinedGame", (data: string) => {
      setJoinedGameCode(data);
    });

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("joinedGame");
    };
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (gameCode.length === 4) {
      socket.emit("joinGame", gameCode);
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (parseInt(event.target.value, 10)) {
      setGameCode(event.target.value);
    }
  };

  return (
    <div>
      <h1>Joined Game: {joinedGameCode}</h1>
      <form onSubmit={handleSubmit}>
        <input name="gameCode" value={gameCode} onChange={handleChange} />
        <button type="submit">Join Game</button>
      </form>
    </div>
  );
}
