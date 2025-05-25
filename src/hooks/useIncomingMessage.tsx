import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useSocketContext } from "@/contexts/SocketContext";
import {
  useConversation,
  useConversationActions,
} from "@/contexts/ConversationContext";
import { useSession } from "next-auth/react";

const useIncomingMessage = () => {
  const { socket, listenMessage } = useSocketContext();
  const { conversations } = useConversation();
  const { addMessage, setLastMessage } = useConversationActions();
  const { toast } = useToast();
  const { data: session } = useSession();

  useEffect(() => {
    if (socket && conversations.length) {
      const handleMessage = (data: {
        conversationId: string;
        content: string;
        sender: { id: string; username: string };
        recipient: { id: string; username: string };
        status?: "sent" | "delivered" | "read";
      }) => {
        const { conversationId, content, sender, recipient } = data;

        const messageData = {
          conversationId: conversationId,
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
          status: data.status || ("sent" as const),
          isCurrentUser: sender.id === session?.user.id,
        };

        const isCurrentUser = sender.id === session?.user.id;
        addMessage(messageData);
        setLastMessage({
          lastMessageIsCurrentUser: isCurrentUser,
          conversationId: conversationId,
          lastMessageContent: content,
          lastMessageTime: new Date().toString(),
        });

        // Only show toast for messages from others
        if (!isCurrentUser) {
          toast({
            title: sender.username,
            description: content,
          });
        }
      };
      listenMessage(handleMessage);

      return () => {
        socket.off("message", handleMessage);
      };
    }
  }, [
    listenMessage,
    conversations,
    session?.user.id,
    socket,
    addMessage,
    setLastMessage,
    toast,
  ]);
};

export default useIncomingMessage;
