"use client";
import Header from "@/components/header/Header";
import ConversationList from "@/components/conversation/ConversationList";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import { useSocketContext } from "@/contexts/SocketContext";
import ConversationContainer from "@/components/conversation/ConversationContainer";
import { useAppDispatch, useAppSelector } from "@/hooks/use-dispatch-selector";
import { useEffect } from "react";
import { setLastMessage } from "@/redux-toolkit/features/conversations/conversationSlice";

export default function Home() {
  const { socket, connected, listenSendMessage } = useSocketContext();
  const selectedConversation = useAppSelector(
    (state) => state.conversation.selectedConversation
  );
  const conversation = useAppSelector(
    (state) => state.conversation.conversations
  );
  const dispatch = useAppDispatch();
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

  useEffect(() => {
    if (socket && conversation.length) {
      listenSendMessage((data) => {
        const { conversationId, content, sender } = data;
        conversation.forEach((c) => {
          if (c.id === conversationId) {
            dispatch(
              setLastMessage({
                conversationId: conversationId,
                lastMessageContent: content,
                lastMessageTime: new Date().toString(),
              })
            );
          }
        });
        toast({
          title: sender.username,
          description: content,
        });
      });
    }
  }, [listenSendMessage, conversation]);

  return (
    <>
      <Header />
      <main className="bg-background">
        <ConversationList />
        {selectedConversation.id && <ConversationContainer />}
      </main>
    </>
  );
}
