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
      const listener = listenMessage(handleReceiveMessage);

      // Request pending messages AFTER listener is ready
      socket.emit("client:request_pending");
      console.log("Requested pending messages");

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
