// lazily inits a singleton socket for a given
// namespace. CLIENT SIDE (BROWSER) ONLY

import { useEffect, useState } from "react";
import { Manager } from "socket.io-client";

let namespaces = {};

if (!process.env.NEXT_PUBLIC_SOCKET_IO_URL) {
  throw new Error(
    "Please add NEXT_PUBLIC_SOCKET_URL to your environment variabeles"
  );
}

function useSocket(namespace = "gameterminals") {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // init and store within global var if we are in development mode to avoid
    // double init caused by hotreloading:
    if (process.env.NODE_ENV === "development") {
      // store in global state in dev mode to avoid issues
      // with hot reload
      if (!global.socketNamespaces) global.socketNamespaces = {};
      if (!global.socketNamespaces[namespace]) {
        const manager = new Manager(process.env.NEXT_PUBLIC_SOCKET_IO_URL);
        const socket = manager.socket(`/${namespace}`);
        global.socketNamespaces[namespace] = { socket, manager };
      }

      setSocket(global.socketNamespaces[namespace].socket);
    } else {
      // init if the socket hasn't been created:
      if (!namespaces[namespace]) {
        const manager = new Manager(process.env.NEXT_PUBLIC_SOCKET_IO_URL);
        const socket = manager.socket(`/${namespace}`);
        namespaces[namespace] = { socket, manager };
      }

      // return the socket for the give namespace
      setSocket(namespaces[namespace].socket);
    }
  }, []);

  return socket;
}

export default useSocket;
