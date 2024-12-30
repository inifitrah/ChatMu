// import { createServer } from "node:http";
import express from "express";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const turbopack = process.env.TURBOPACK === "1";
const hostname = "localhost";
const port = 3000;
const expressApp = express();
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  expressApp.all("*", (req, res) => {
    return handler(req, res);
  });
  const httpServer = expressApp.listen(port, async () => {
    console.log(
      `> Ready on http://${hostname}:${port} - development:${dev} turbopack:${turbopack}`
    );
  });

  const io = new Server(httpServer);

  let onlineUsers = [];

  io.on("connection", (socket) => {
    console.log(">>SOCKET: CONNECTED ", socket.id);

    socket.on("online", (username) => {
      if (!onlineUsers.some((user) => user.username === username)) {
        onlineUsers.push({ username, socketId: socket.id });
        console.log(">>SOCKET: new user is here!", onlineUsers);
      }
      io.emit("getOnlineUsers", onlineUsers);
    });

    socket.on("message", (message) => {
      const receivedUser = onlineUsers.find(
        (user) => user.username === message.to
      );
      console.log("message: ", message);
      console.log("receivedUser: ", receivedUser || "offline");
      if (receivedUser) {
        socket.to(receivedUser.socketId).emit("receiveMessage", message);
      }
    });

    socket.on("disconnect", () => {
      onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
      io.emit("getOnlineUsers", onlineUsers);
      console.log(">>SOCKET: DISCONNECTED", socket.id);
    });
  });
});
