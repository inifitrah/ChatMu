import {
  useConversation,
  useConversationActions,
} from "@/contexts/ConversationContext";
import { useSocketContext } from "@/contexts/SocketContext";
import { IMessage, ISelectedConversation } from "@/types/conversation";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

const useMessageHandling = (conversation: ISelectedConversation) => {
  const { markAsRead, listenMarkAsRead } = useSocketContext();
  const { data: session } = useSession();
  const { messages: allMessages } = useConversation();
  const messages = allMessages.filter(
    (message) => message.conversationId === conversation.id
  );
  const { addMessage, setLastMessage, updateConversationStatus } =
    useConversationActions();
  const { sendMessage } = useSocketContext();

  const handleSendMessage = (newMessage: string) => {
    if (!session || newMessage === "") return;
    const messageData: IMessage = {
      conversationId: conversation.id,
      sender: {
        id: session.user.id,
        username: session.user.username,
      },
      recipient: {
        id: conversation.userId,
        username: conversation.username,
      },
      content: newMessage,
      type: "text" as const,
      status: "sent" as const,
      isCurrentUser: true,
    };
    sendMessage(messageData);
    addMessage(messageData);
    setLastMessage({
      lastMessageIsCurrentUser: true,
      conversationId: messageData.conversationId,
      lastMessageContent: messageData.content,
      lastMessageTime: new Date().toString(),
    });
    updateConversationStatus(messageData.conversationId, messageData.status);
  };

  useEffect(() => {
    if (session && conversation.id) {
      if (
        messages.length > 0 &&
        messages[messages.length - 1].isCurrentUser === false &&
        messages[messages.length - 1].status !== "read"
      ) {
        updateConversationStatus(conversation.id, "read" as const);
        markAsRead({
          conversationId: conversation.id,
          userId: conversation.userId,
        });
      }

      if (
        messages.length > 0 &&
        messages[messages.length - 1].isCurrentUser === true
      ) {
        listenMarkAsRead((conversationId: string) => {
          updateConversationStatus(conversationId, "read" as const);
        });
      }
    }
  }, [conversation.id, session, messages]);

  return { messages, handleSendMessage };
};

export default useMessageHandling;
