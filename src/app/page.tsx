"use client";
import Header from "@/components/header/Header";
import ChatList from "@/components/chat/ChatList";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import { useSocketContext } from "@/contexts/SocketContext";
import { useEffect } from "react";

export default function Home() {
  const { socket, isConnected, isOnline } = useSocketContext();
  const { toast } = useToast();
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      toast({
        description: "Logged Out",
      });
      redirect("/auth");
    },
  });

  return (
    <>
      <Header />
      <main className="">
        <p>Socket: {isConnected ? "Connected" : "Disconnected"}</p>
        <ChatList />
      </main>
    </>
  );
}
