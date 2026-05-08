import { useEffect } from "react";
import { useToast } from "@chatmu/ui";
import { useSocketContext } from "@/contexts/SocketContext";
import {
  useConversation,
  useConversationActions,
} from "@/contexts/ConversationContext";
import { useSession } from "next-auth/react";
import { IMessage } from "@chatmu/shared";

const useIncomingMessage = () => {
  const { socket, listenMessage, reqPending, markAsDelivered, listenMessageSent, retrySendMessage } = useSocketContext();
  const { addMessage, setLastMessage, updateMessageStatus } = useConversationActions();
  const { conversations } = useConversation();
  const { toast } = useToast();
  const { data: session } = useSession();

  useEffect(() => {
    if (socket && conversations.length) {
      const handleReceiveMessage = (data: IMessage) => {
        const { conversationId, content, sender, recipient } = data;

        const messageData = {
          conversationId,
          sender: {
            id: sender.id,
            username: sender.username,
          },
          recipient: {
            id: recipient.id,
            username: recipient.username,
          },
          content: content,
          type: "text" as const,
          status: data.status,
          isCurrentUser: sender.id === session?.user.id,
          timeStamp: new Date(),
        };

        const isCurrentUser = sender.id === session?.user.id;
        addMessage(messageData);
        setLastMessage({
          lastMessageIsCurrentUser: isCurrentUser,
          conversationId,
          lastMessageContent: content,
          lastMessageTime: new Date(),
          status: data.status,
        });

        // Only mark as delivered if message status is "sent" (not already delivered)
        if (data.status === "sent") {
          markAsDelivered({
            conversationId,
            senderId: sender.id,
          });
        }

        // Only show toast for messages from others
        if (!isCurrentUser) {
          toast({
            title: sender.username,
            description: content,
          });
        }
      };

      // Handle message sent confirmation from server - replace tempId with real id
      const handleMessageSent = (data: { tempId: string; id: string; timeStamp: number; conversationId: string; status?: "sent" | "failed" }) => {
        if (data.status === "failed") {
          updateMessageStatus({
            conversationId: data.conversationId,
            newStatus: "failed",
            tempId: data.tempId,
            id: data.id,
          });
        } else {
          updateMessageStatus({
            conversationId: data.conversationId,
            newStatus: "sent",
            tempId: data.tempId,
            id: data.id,
          });
        }
      };

      const listener = listenMessage(handleReceiveMessage);
      const sentListener = listenMessageSent(handleMessageSent);

      // Request pending messages AFTER listener is ready
      reqPending();

      // Cleanup listeners
      return () => {
        listener.off();
        sentListener.off();
      };
    }
  }, [
    listenMessage,
    listenMessageSent,
    conversations,
    session?.user.id,
    socket,
    addMessage,
    setLastMessage,
    toast,
    markAsDelivered,
    updateMessageStatus,
  ]);
};

export default useIncomingMessage;
