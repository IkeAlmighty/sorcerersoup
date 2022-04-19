import { Manager } from "socket.io-client";
import { useState, useEffect } from "react";

export function useSocketIO(namespace) {
  const [socket, setSocket] = useState(null);

  if (!process.env.NEXT_PUBLIC_SOCKET_IO_URL) {
    throw Error("Please set env variable: NEXT_PUBLIC_SOCKET_IO_URL.");
  }

  useEffect(() => {
    const manager = new Manager(process.env.NEXT_PUBLIC_SOCKET_IO_URL);
    const socket = manager.socket(`/${namespace}`);
    setSocket(socket);
  }, []);

  return socket;
}
