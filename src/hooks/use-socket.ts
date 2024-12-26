import { initializeSocket } from "@/lib/socket";
import { useEffect, useRef, useState } from "react";
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
  const socketRef = useRef<Socket | null>(null);
  const { data: session } = useSession();
  const { toast } = useToast();

  useEffect(() => {
    socketRef.current = initializeSocket();

    socketRef.current.on("connect", () => {
      setIsConnected(true);
    });

    if (session) {
      socketRef.current?.emit("online", session.user.username);
      setIsOnline(true);
      toast({
        description: "Login socket",
      });
      socketRef.current.on("getOnlineUsers", (users: string[]) => {
        setOnlineUsers(users);
      });
    }

    socketRef.current.on("disconnect", () => {
      setIsConnected(false);
      toast({
        variant: "destructive",
        description: "Logout socket",
      });
    });
  }, [session, socketRef.current]);

  return { socket: socketRef.current, isConnected, isOnline, onlineUsers };
};
