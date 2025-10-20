import {
  useConversation,
  useConversationActions,
} from "@/contexts/ConversationContext";
import { useSocketContext } from "@/contexts/SocketContext";
import { IMessage, ISelectedConversation } from "@chatmu/shared";
import { useSession } from "next-auth/react";
import { useEffect, useMemo } from "react";

const useMessageHandling = (conversation: ISelectedConversation) => {
  const { markAsRead } = useSocketContext();
  const { data: session } = useSession();
  const { messages: allMessages } = useConversation();
  const messages = useMemo(
    () =>
      allMessages.filter(
        (message) => message.conversationId === conversation.conversationId
      ),
    [allMessages, conversation.conversationId]
  );
  const {
    addMessage: setMessage,
    setLastMessage,
    updateConversationStatus,
  } = useConversationActions();
  const { sendMessage } = useSocketContext();

  const handleSendMessage = (newMessage: string) => {
    if (!session || newMessage === "") return;
    const messageData: IMessage = {
      tempId: Math.random().toString(26),
      conversationId: conversation.conversationId,
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
      status: "sending" as const,
      isCurrentUser: true,
      timeStamp: new Date(),
    };
    sendMessage(messageData);
    setMessage(messageData);
    setLastMessage({
      lastMessageIsCurrentUser: true,
      conversationId: messageData.conversationId,
      lastMessageContent: messageData.content,
      lastMessageTime: new Date().toString(),
      status: messageData.status,
    });
  };

  useEffect(() => {
    if (conversation.conversationId) {
      if (
        messages.length > 0 &&
        messages[messages.length - 1].isCurrentUser === false &&
        messages[messages.length - 1].status !== "read"
      ) {
        updateConversationStatus(conversation.conversationId, "read");
        markAsRead({
          conversationId: conversation.conversationId,
          userId: conversation.userId,
        });
      }
    }
  }, [conversation.conversationId, messages.length]);

  return { messages, handleSendMessage };
};

export default useMessageHandling;
