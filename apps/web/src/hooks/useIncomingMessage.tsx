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
  const { socket, listenMessage, markAsDelivered } = useSocketContext();
  const { addMessage, setLastMessage } = useConversationActions();
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
          lastMessageTime: new Date().toString(),
          status: data.status,
        });
        markAsDelivered({
          conversationId,
          senderId: sender.id,
        });
        // Only show toast for messages from others
        if (!isCurrentUser) {
          toast({
            title: sender.username,
            description: content,
          });
        }
      };
      const listener = listenMessage(handleReceiveMessage);

      // Cleanup listener
      return () => listener.off();
    }
  }, [
    listenMessage,
    conversations,
    session?.user.id,
    socket,
    addMessage,
    setLastMessage,
    toast,
    markAsDelivered,
  ]);
};

export default useIncomingMessage;
