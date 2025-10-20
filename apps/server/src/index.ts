import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import { setupSocketHandlers } from "./socket/handlers.js";

const port = parseInt(process.env.PORT || "3003", 10);
const hostname = process.env.HOSTNAME || "localhost";

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Create HTTP server
const server = createServer(app);

// Setup Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Setup socket handlers
setupSocketHandlers(io);

// Start server
server.listen(port, hostname, () => {
  console.log(`🚀 Socket.IO server running on http://${hostname}:${port}`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing HTTP server");
  server.close(() => {
    console.log("HTTP server closed");
  });
});
