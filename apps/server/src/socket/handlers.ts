import { Server, Socket } from "socket.io";
import { IMessage } from "@chatmu/shared";
import { Message, Conversation } from "@chatmu/database"

type OnlineUser = { userId: string; socketId: string; username: string };

export async function setupSocketHandlers(io: Server) {
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
    socket.on("client:send_message", async (data: IMessage) => {
      try {
        // save message to db
        const newMessage = new Message({
          conversationId: data.conversationId,
          sender: data.sender.id,
          content: data.content,
        });
        await newMessage.save();

        await Conversation.findByIdAndUpdate(data.conversationId, {
          lastMessage: newMessage._id,
        });


        // Confirm message sent to sender
        socket.emit("server:message_sent", {
          id: newMessage._id.toString(),
          tempId: data.tempId,
          timeStamp: newMessage.timestamp || Date.now(),
          conversationId: data.conversationId,
        });

        const savedMessage = {
          ...data,
          status: "sent",
          timeStamp: newMessage.timestamp || Date.now(),
          id: newMessage._id.toString(),
          conversationId: data.conversationId,
        };

        // Send message to recipient if online
        const receivedUser = onlineUsers.find(
          (user) => user.userId === data.recipient.id
        );

        if (receivedUser) {
          socket
            .to(receivedUser.socketId)
            .emit("server:new_message", savedMessage);
        }
      } catch (error) {
        console.error("Error saving message:", error);
      }
    });

    // Handle message received acknowledgment
    socket.on(
      "client:message_received",
      async (data: { conversationId: string; senderId: string }) => {
        try {
          // Update status to delivered in database
          await Message.updateMany(
            { conversationId: data.conversationId, sender: data.senderId, status: "sent" },
            { status: "delivered" }
          );

          const senderUser = onlineUsers.find(
            (user) => user.userId === data.senderId
          );
          if (!senderUser) return;

          socket.to(senderUser.socketId).emit("server:message_received", data);
        } catch (error) {
          console.error("Error updating message delivered status:", error);
        }
      }
    );

    // Handle message read acknowledgment
    socket.on("client:message_read", async ({ conversationId, userId }) => {
      try {
        // Update status to read in database
        await Message.updateMany(
          { conversationId, sender: userId, status: { $ne: "read" } },
          { status: "read" }
        );

        const receivedUser = onlineUsers.find((user) => user.userId === userId);

        if (receivedUser) {
          socket
            .to(receivedUser.socketId)
            .emit("server:mark_as_read", conversationId);
        }
      } catch (error) {
        console.error("Error updating message read status:", error);
      }
    });

    // Handle disconnect
    socket.on("disconnect", () => {
      onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
      io.emit("get_online_users", onlineUsers);
    });
  });
}
