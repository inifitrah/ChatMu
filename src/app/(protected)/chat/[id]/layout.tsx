"use client";
import { useToast } from "@/hooks/use-toast";
import { getSocket } from "@/lib/socket";
import { useSession } from "next-auth/react";
import React, { useEffect } from "react";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const socket = getSocket();
  const { data: session } = useSession();
  const { toast } = useToast();

  useEffect(() => {
    socket.on("connect", () => {
      toast({
        description: "Is Online",
      });
    });
    if (session?.user.username) {
      socket.emit("online", session?.user.username);
    }

    socket.on("disconnect", () => {
      toast({
        description: "Is Offline",
      });
    });
    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("online");
    };
  }, [session]);

  return <main className="flex h-screen flex-col">{children}</main>;
}
