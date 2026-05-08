import {
  useConversation,
  useConversationActions,
} from "@/contexts/ConversationContext";
import { useSocketContext } from "@/contexts/SocketContext";
import { IMessage, ISelectedConversation } from "@chatmu/shared";
import { useSession } from "next-auth/react";
import { useEffect, useMemo } from "react";
import { getOrCreateConversation, getMessages } from "@/app/actions/conversationActions";

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
    addMessage,
    setLastMessage,
    updateConversationStatus,
    updateMessageStatus,
    setSelectedConversation,
    setMessages,
    mergeMessages,
  } = useConversationActions();

  // Load initial messages when conversation is selected
  useEffect(() => {
    const conversationId = conversation.conversationId;
    if (!conversationId || !session?.user?.id) return;

    let cancelled = false;

    const loadMessages = async () => {
      const fetchedMessages = await getMessages(
        conversationId,
        session.user.id
      );

      if (!cancelled && fetchedMessages) {
        mergeMessages(conversationId, fetchedMessages);
      }
    };

    loadMessages();

    return () => {
      cancelled = true;
    };
  }, [conversation.conversationId, session?.user?.id]);
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

    addMessage(messageData);
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
        updateMessageStatus({
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
