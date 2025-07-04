import express from "express";
import { createServer } from "http";
import next from "next";
import { Server } from "socket.io";

import { IMessage } from "@/types/conversation";

const port = parseInt(process.env.PORT || "3003", 10);
const hostname = "localhost";
const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev, hostname, port });
const handle = nextApp.getRequestHandler();

nextApp.prepare().then(() => {
  const app = express();
  const server = createServer(app);
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  type OnlineUser = { userId: string; socketId: string; username: string };
  let onlineUsers: OnlineUser[] = [];

  io.on("connection", (socket) => {
    const { id, username } = socket.handshake.query;

    if (!onlineUsers.some((user) => user.username === username)) {
      onlineUsers.push({
        userId: typeof id === "string" ? id : "",
        username: typeof username === "string" ? username : "",
        socketId: socket.id,
      });
    }

    io.emit("get_online_users", onlineUsers);

    socket.on("client:send_message", (data: IMessage) => {
      const savedMessage = {
        ...data,
        status: "sent",
        timeStamp: Date.now(),
        id: `server-${data.id}`,
        conversationId: data.conversationId,
      };
      socket.emit("server:message_sent", {
        tempId: data.id,
        serverId: savedMessage.id,
        timeStamp: Date.now(),
        conversationId: savedMessage.conversationId,
      });

      const receivedUser = onlineUsers.find(
        (user) => user.userId === data.recipient.id
      );

      if (receivedUser) {
        socket
          .to(receivedUser.socketId)
          .emit("server:new_message", savedMessage);
      }
    });

    socket.on(
      "client:message_received",
      (data: { conversationId: string; senderId: string }) => {
        const senderUser = onlineUsers.find(
          (user) => user.userId === data.senderId
        );
        if (!senderUser) return;

        socket.to(senderUser.socketId).emit("server:message_received", data);
      }
    );

    socket.on("client:message_read", ({ conversationId, userId }) => {
      const receivedUser = onlineUsers.find((user) => user.userId === userId);

      if (receivedUser) {
        socket
          .to(receivedUser.socketId)
          .emit("server:mark_as_read", conversationId);
      }
    });

    socket.on("disconnect", () => {
      onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
      io.emit("get_online_users", onlineUsers);
    });
  });

  app.all("*", (req, res) => {
    return handle(req, res);
  });

  server.listen(port, (err?: Error) => {
    if (err) throw err;
    console.log(`> Socket on http://${hostname}:${port}`);
  });
});
