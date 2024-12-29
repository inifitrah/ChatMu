import { initializeSocket } from "@/lib/socket";
import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { useToast } from "./use-toast";
import { useSession } from "next-auth/react";

interface UseSocketReturn {
  socket: Socket | null;
  isConnected: boolean;
  isOnline: boolean;
  onlineUsers: string[];
}

export const useSocket = (): UseSocketReturn => {
  const [isConnected, setIsConnected] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const { data: session } = useSession();
  const { toast } = useToast();

  useEffect(() => {
    if (!session) return;
    const socket = initializeSocket();
    if (socket.disconnected) {
      socket.connect();
      setIsConnected(true);
    }

    const handleSocketConnect = () => {
      if (socket.connected) {
        socket?.emit("online", session.user.username);
        setIsOnline(true);
        toast({
          description: "Is Online",
        });
      }
    };
    const handleGetOnlineUsers = (users: string[]) => {
      setOnlineUsers(users);
    };
    const handleDisconnect = () => {
      if (socket.disconnected) {
        setIsConnected(false);
      }
    };

    socket.on("connect", handleSocketConnect);
    socket.on("getOnlineUsers", handleGetOnlineUsers);
    socket.on("disconnect", handleDisconnect);
    setSocket(socket);
    return () => {
      socket.off("connect");
      socket.off("getOnlineUsers");
      socket.off("disconnect");
      if (socket && socket.connected) {
        socket.disconnect();
        setIsConnected(false);
      }
    };
  }, [session]);

  return { socket, isConnected, isOnline, onlineUsers };
};
