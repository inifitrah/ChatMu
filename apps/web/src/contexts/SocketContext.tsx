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
import { useToast } from "@chatmu/ui";
import { IMessage } from "@chatmu/shared";
type ContextType = {
  socket: Socket | undefined;
  connected: boolean;

  sendMessage: (data: IMessage) => void;
  markAsDelivered: (data: { senderId: string; conversationId: string }) => void;
  markAsRead: (data: { conversationId: string; userId: string }) => void;

  listenMessage: (callback: (data: IMessage) => void) => { off: () => void };
  listenMessageReceived: (
    callback: (data: { senderId: string; conversationId: string }) => void
  ) => { off: () => void };
  listenMessageSent: (
    callback: (data: {
      tempId: string;
      serverId: string;
      timeStamp: number;
      conversationId: string;
    }) => void
  ) => { off: () => void };
  listenMessageRead: (callback: (data: any) => void) => { off: () => void };
  listenOnlineUsers: (
    callback: (
      data: { userId: string; username: string; socketId: string }[]
    ) => void
  ) => { off: () => void };
};

const defaultValue: ContextType = {
  socket: undefined,
  sendMessage: () => {},
  markAsDelivered: () => {},
  listenMessageSent: () => ({ off: () => {} }),
  listenMessageReceived: () => ({ off: () => {} }),
  listenMessage: () => ({ off: () => {} }),
  markAsRead: () => {},
  listenMessageRead: () => ({ off: () => {} }),
  listenOnlineUsers: () => ({ off: () => {} }),
  connected: false,
};

const SocketContext = createContext<ContextType>(defaultValue);

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
  }, [session, toast]);

  const value: ContextType = useMemo(() => {
    const createListener =
      (eventName: string) => (callback: (data: any) => void) => {
        if (socket) {
          socket.on(eventName, callback);
          return {
            off: () => {
              socket.off(eventName, callback);
            },
          };
        } else {
          console.warn(
            `Socket is not initialized. Cannot listen to event: ${eventName}`
          );
          return {
            off: () => {},
          };
        }
      };

    const createEmitter = (eventName: string) => (data: any) => {
      if (socket) {
        socket.emit(eventName, data);
      } else {
        console.warn(
          `Socket is not initialized. Cannot emit event: ${eventName}`
        );
      }
    };

    return {
      socket,
      connected: alreadyConnect,
      sendMessage: createEmitter("client:send_message"),
      listenMessageReceived: createListener("server:message_received"),
      markAsDelivered: createEmitter("client:message_received"),
      listenMessageSent: createListener("server:message_sent"),
      listenMessage: createListener("server:new_message"),
      markAsRead: createEmitter("client:message_read"),
      listenMessageRead: createListener("server:mark_as_read"),
      listenOnlineUsers: createListener("get_online_users"),
    };
  }, [alreadyConnect, socket]);

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
