import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
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
    if (session) {
      const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        query: {
          id: session.user?.id,
          username: session.user?.username,
        },
      });
      socket.on("connect", () => {
        setIsConnected(true);
        setIsOnline(true);
        toast({
          description: "Is Online",
        });
      });
      socket.on("getOnlineUsers", (users) => {
        setOnlineUsers(users);
      });
      socket.on("disconnect", () => {
        setIsConnected(false);
      });
      setSocket(socket);
      return () => {
        socket.off("connect");
        socket.off("getOnlineUsers");
        socket.off("disconnect");
        if (socket && socket.connected) {
          socket.disconnect();
          setIsConnected(false);
          setSocket(null);
        }
      };
    } else {
      if (socket) {
        socket.close();
      }
      return;
    }
  }, [session]);

  return { socket, isConnected, isOnline, onlineUsers };
};
