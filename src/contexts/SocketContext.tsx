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
import { IMessage } from "@/types/conversation";
type ContextType = {
  socket: Socket | undefined;
  connected: boolean;
  sendMessage: (data: IMessage) => void;
  listenMessage: (callback: (data: IMessage) => void) => void;
  markAsRead: (data: { conversationId: string; userId: string }) => void;
  listenMarkAsRead: (callback: (data: any) => void) => void;
  listenOnlineUsers: (
    callback: (
      data: { userId: string; username: string; socketId: string }[]
    ) => void
  ) => void;
};

const defaultValue: ContextType = {
  socket: undefined,
  sendMessage() {},
  listenMessage() {},
  markAsRead() {},
  listenMarkAsRead() {},
  listenOnlineUsers() {},
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
  }, [session]);

  const value: ContextType = useMemo(
    () => ({
      socket,
      connected: alreadyConnect,
      sendMessage(data) {
        if (socket) {
          socket.off("send_message");
          socket.emit("send_message", data);
        }
      },
      listenMessage(callback) {
        if (socket) {
          socket.off("send_message");
          socket.on("send_message", callback);
        }
      },
      markAsRead(data) {
        if (socket) {
          socket.off("mark_as_read");
          socket.emit("mark_as_read", data);
        }
      },
      listenMarkAsRead(callback) {
        if (socket) {
          socket.off("mark_as_read");
          socket.on("mark_as_read", callback);
        }
      },
      listenOnlineUsers(callback) {
        if (socket) {
          socket.off("get_online_users");
          socket.on("get_online_users", callback);
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
