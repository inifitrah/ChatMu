import { Socket } from "socket.io-client";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { io } from "socket.io-client";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
type ContextType = {
  socket: Socket | undefined;
  connected: boolean;
  sendMessage: (data: any) => void;
  listenSendMessage: (callback: (data: any) => void) => void;
  markAsRead: (data: any) => void;
  listenMarkAsRead: (callback: (data: any) => void) => void;
};

const defaultValue: ContextType = {
  socket: undefined,
  sendMessage() {},
  listenSendMessage() {},
  markAsRead() {},
  listenMarkAsRead() {},
  connected: false,
};

const SocketContext = createContext(defaultValue);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<Socket | undefined>(undefined);
  const [alreadyConnect, setAlreadyConnect] = useState<boolean>(false);
  const { data: session } = useSession();
  const { toast } = useToast();

  useEffect(() => {
    if (session) {
      const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        query: {
          id: session.user.id,
          username: session.user.username,
        },
      });
      socket.on("connect", () => {
        setAlreadyConnect(true);
        toast({
          description: `Connected as ${session.user.username}`,
        });
      });
      socket.on("disconnect", () => {
        setAlreadyConnect(false);
      });
      setSocket(socket);
      return () => {
        socket.off("connect");
        socket.off("getOnlineUsers");
        socket.off("disconnect");
        if (socket && socket.connected) {
          socket.disconnect();
          setAlreadyConnect(false);
          setSocket(undefined);
        }
      };
    } else {
      if (socket) {
        socket.close();
      }
      return;
    }
  }, [session, socket, toast]);

  const value: ContextType = useMemo(
    () => ({
      socket,
      connected: alreadyConnect,
      sendMessage(data) {
        if (socket) {
          socket.emit("send_message", data);
        }
      },
      listenSendMessage(callback) {
        if (socket) {
          socket.on("send_message", callback);
        }
      },
      markAsRead(data) {
        if (socket) {
          socket.emit("mark_as_read", data);
        }
      },
      listenMarkAsRead(callback) {
        if (socket) {
          socket.on("mark_as_read", callback);
        }
      },
    }),
    [alreadyConnect, socket]
  );
  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};

export const useSocketContext = () => {
  const context = useContext(SocketContext);

  if (!context) {
    throw new Error("useSocketContext must be used within a SocketProvider");
  }

  return context;
};
