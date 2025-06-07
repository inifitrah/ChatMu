"use client";
import Header from "@/components/header/Header";
import ConversationList from "@/components/conversation/ConversationList";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import ConversationContainer from "@/components/conversation/ConversationContainer";
import {
  useConversation,
  useConversationActions,
} from "@/contexts/ConversationContext";
import useIncomingMessage from "@/hooks/useIncomingMessage";
import { useEffect } from "react";
import { useSocketContext } from "@/contexts/SocketContext";

function ConversationArea() {
  const { selectedConversation } = useConversation();
  return (
    <>
      <ConversationList />
      {selectedConversation && (
        <ConversationContainer conversation={selectedConversation} />
      )}
    </>
  );
}

export default function Home() {
  const { listenMessageSent, listenMessageReceived } = useSocketContext();
  const { updateConversationStatus } = useConversationActions();
  const { toast } = useToast();
  useSession({
    required: true,
    onUnauthenticated() {
      toast({
        description: "Logged Out",
      });
      redirect("/auth");
    },
  });

  useIncomingMessage();

  useEffect(() => {
    listenMessageSent((data) => {
      updateConversationStatus(data.conversationId, "sent");
    });
  }, [listenMessageSent]);

  useEffect(() => {
    listenMessageReceived((data) => {
      updateConversationStatus(data.conversationId, "delivered");
    });
  }, [listenMessageReceived]);

  return (
    <div className="wrapper-page">
      <Header />
      <main className="bg-background">
        <ConversationArea />
      </main>
    </div>
  );
}
