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

  let onlineUsers = []; // [{ userId: "123", socketId: "123", username: "user1" }]

  io.on("connection", (socket) => {
    const { id, username } = socket.handshake.query;
    if (!onlineUsers.some((user) => user.username === username)) {
      onlineUsers.push({
        userId: id,
        username,
        socketId: socket.id,
      });
    }

    io.emit("get_online_users", onlineUsers);

    socket.on("send_message", (data) => {
      const receivedUser = onlineUsers.find(
        (user) => user.userId === data.recipient.id
      );

      if (receivedUser) {
        socket.to(receivedUser.socketId).emit("send_message", data);
      }
    });

    socket.on("mark_as_read", ({ conversationId, userId }) => {
      const receivedUser = onlineUsers.find((user) => user.userId === userId);

      if (receivedUser) {
        socket.to(receivedUser.socketId).emit("mark_as_read", conversationId);
      }
    });

    socket.on("disconnect", () => {
      onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
      io.emit("get_online_users", onlineUsers);
    });
  });
});
