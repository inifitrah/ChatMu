import { useSocket } from "@/hooks/use-socket";
import { createContext, ReactNode, useContext } from "react";

const SocketContext = createContext<ReturnType<typeof useSocket> | null>(null);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const socket = useSocket();

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocketContext = () => {
  const context = useContext(SocketContext);

  if (!context) {
    throw new Error("useSocketContext must be used within a SocketProvider");
  }

  return context;
};
