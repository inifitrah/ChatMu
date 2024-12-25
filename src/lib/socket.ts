"use client";
import { io, Socket } from "socket.io-client";

let socket: Socket | undefined;

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io("http://localhost:3000");
  }
  return socket;
};
