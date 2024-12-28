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
    const socket = initializeSocket();
    const handleGetOnlineUsers = (users: string[]) => {
      setOnlineUsers(users);
    };
    const handleSocketConnect = () => {
      setIsConnected(true);
    };
    const handleDisconnect = () => {
      setIsConnected(false);
      toast({
        variant: "destructive",
        description: "Logout socket",
      });
    };

    socket.on("connect", handleSocketConnect);
    if (session) {
      socket?.emit("online", session.user.username);
      setIsOnline(true);
      toast({
        description: "Login socket",
      });
    }
    socket.on("getOnlineUsers", handleGetOnlineUsers);
    socket.on("disconnect", handleDisconnect);
    setSocket(socket);

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("getOnlineUsers");
      if (socket) {
        socket.disconnect();
      }
    };
  }, [session]);

  return { socket, isConnected, isOnline, onlineUsers };
};
