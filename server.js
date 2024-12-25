import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer);

  let onlineUsers = [];

  io.on("connection", (socket) => {
    console.log("new connected ", socket.id);
    socket.on("online", (username) => {
      if (!onlineUsers.some((user) => user.username === username)) {
        onlineUsers.push({ username, socketId: socket.id });
        console.log("new user is here!", onlineUsers);
      }
      io.emit("getOnlineUsers", onlineUsers);
    });

    socket.on("message", (message) => {
      const receivedUser = onlineUsers.find(
        (user) => user.username === message.to
      );
      console.log("message: ", message);
      console.log("receivedUser: ", receivedUser);
      if (receivedUser) {
        socket.to(receivedUser.socketId).emit("receiveMessage", message);
      }
    });

    socket.on("disconnect", () => {
      onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
      io.emit("getOnlineUsers", onlineUsers);
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, async () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
