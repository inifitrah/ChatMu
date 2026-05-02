import {
  useConversation,
  useConversationActions,
} from "@/contexts/ConversationContext";
import { useSocketContext } from "@/contexts/SocketContext";
import { IMessage, ISelectedConversation } from "@chatmu/shared";
import { useSession } from "next-auth/react";
import { useEffect, useMemo } from "react";
import { getOrCreateConversation } from "@/app/actions/conversationActions";

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
    updateMessagesStatus,
    setSelectedConversation,
  } = useConversationActions();
  const { sendMessage } = useSocketContext();

  const ensureConversationId = async (): Promise<string | null> => {
       if (conversation.conversationId) {
         return conversation.conversationId;
       }

       if (!session) {
         return null;
       }

       const result = await getOrCreateConversation(
         session.user.id,
         conversation.userId
       );
       const conversationId = result?._id;

       if (!conversationId) {
         return null;
       }

       setSelectedConversation({
         conversationId,
         userId: conversation.userId,
         username: conversation.username,
         profileImage: conversation.profileImage,
       });

       return conversationId;
     };

  const handleSendMessage = async (newMessage: string) => {
    if (!session || newMessage === "") return;
     const conversationId = await ensureConversationId()
     if(!conversationId) return

    const messageData: IMessage = {
      tempId: Math.random().toString(26),
      conversationId,
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
      conversationId,
      lastMessageContent: messageData.content,
      lastMessageTime: new Date(),
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
        updateMessagesStatus({
            conversationId: conversation.conversationId,
            newStatus: "read"
        } )
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
