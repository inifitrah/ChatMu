import { Server, Socket } from "socket.io";
import { IMessage } from "@chatmu/shared";

type OnlineUser = { userId: string; socketId: string; username: string };

export function setupSocketHandlers(io: Server) {
  let onlineUsers: OnlineUser[] = [];

  io.on("connection", (socket: Socket) => {
    const { id, username } = socket.handshake.query;

    // Add user to online users list
    if (!onlineUsers.some((user) => user.username === username)) {
      onlineUsers.push({
        userId: typeof id === "string" ? id : "",
        username: typeof username === "string" ? username : "",
        socketId: socket.id,
      });
    }

    // Broadcast online users
    io.emit("get_online_users", onlineUsers);

    // Handle send message
    socket.on("client:send_message", (data: IMessage) => {
      const savedMessage = {
        ...data,
        status: "sent",
        timeStamp: Date.now(),
        id: `server-${data.id}`,
        conversationId: data.conversationId,
      };

      // Confirm message sent to sender
      socket.emit("server:message_sent", {
        tempId: data.id,
        serverId: savedMessage.id,
        timeStamp: Date.now(),
        conversationId: savedMessage.conversationId,
      });

      // Send message to recipient if online
      const receivedUser = onlineUsers.find(
        (user) => user.userId === data.recipient.id
      );

      if (receivedUser) {
        socket
          .to(receivedUser.socketId)
          .emit("server:new_message", savedMessage);
      }
    });

    // Handle message received acknowledgment
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

    // Handle message read acknowledgment
    socket.on("client:message_read", ({ conversationId, userId }) => {
      const receivedUser = onlineUsers.find((user) => user.userId === userId);

      if (receivedUser) {
        socket
          .to(receivedUser.socketId)
          .emit("server:mark_as_read", conversationId);
      }
    });

    // Handle disconnect
    socket.on("disconnect", () => {
      onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
      io.emit("get_online_users", onlineUsers);
    });
  });
}
