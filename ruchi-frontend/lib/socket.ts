import { io, Socket } from "socket.io-client";
import { SOCKET_URL } from "./constants";

let socket: Socket | null = null;

export function initSocket(token: string): Socket {
  if (socket) return socket;

  socket = io(SOCKET_URL, {
    auth: { token },
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
  });

  return socket;
}

export function getSocket(): Socket | null {
  return socket;
}

export function disconnectSocket(): void {
  socket?.disconnect();
  socket = null;
}

export function emitMessage(receiverId: string, content: string): void {
  socket?.emit("message:send", { receiver_id: receiverId, content });
}

export function emitTyping(receiverId: string, isTyping: boolean): void {
  socket?.emit(isTyping ? "typing:start" : "typing:stop", {
    receiver_id: receiverId,
  });
}
