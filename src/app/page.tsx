"use client";
import Header from "@/components/header/Header";
import ConversationList from "@/components/conversation/ConversationList";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import { useSocketContext } from "@/contexts/SocketContext";
import ConversationContainer from "@/components/conversation/ConversationContainer";
import { useSelector } from "react-redux";

export default function Home() {
  const { isConnected } = useSocketContext();

  const selectedConversation = useSelector(
    (state) => state.conversation.selectedConversation
  );

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
        <ConversationList />
        {selectedConversation.id && <ConversationContainer />}
      </main>
    </>
  );
}
