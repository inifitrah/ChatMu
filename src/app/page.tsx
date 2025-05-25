"use client";
import Header from "@/components/header/Header";
import ConversationList from "@/components/conversation/ConversationList";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import ConversationContainer from "@/components/conversation/ConversationContainer";
import { useConversation } from "@/contexts/ConversationContext";
import useIncomingMessage from "@/hooks/useIncomingMessage";

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

  return (
    <div className="wrapper-page">
      <Header />
      <main className="bg-background">
        <ConversationArea />
      </main>
    </div>
  );
}
