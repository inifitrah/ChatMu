import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useSocketContext } from "@/contexts/SocketContext";
import ConversationHeader from "./ConversationHeader";
import MessageContainer from "./MessageContainer";
import MessageInput from "./MessageInput";
import { IMessage, ISelectedConversation } from "@/types/conversation";
import {
  useConversation,
  useConversationActions,
} from "@/contexts/ConversationContext";
import { useAppSelector } from "@/hooks/use-dispatch-selector";
interface ConversationContainerProps {
  conversation: ISelectedConversation;
}

const ConversationContainer = ({
  conversation,
}: ConversationContainerProps) => {
  const { socket, markAsRead, listenMarkAsRead, listenMessage } =
    useSocketContext();
  const { data: session } = useSession();
  const { messages: msgDatas } = useConversation();
  const messages = msgDatas.filter(
    (message) => message.conversationId === conversation.id
  );
  const {
    addMessage,
    setLastMessage,
    updateConversationStatus,
    setSelectedConversation,
  } = useConversationActions();
  const isOnline = useAppSelector((state) =>
    state.user.onlineUsers.find((user) => user.userId === conversation.userId)
  );
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

  return (
    <div className="fixed wrapper-page inset-0 z-50 flex flex-col">
      <ConversationHeader
        backButtonClick={() => setSelectedConversation(null)}
        username={conversation.username}
        profileImage={conversation.profileImage}
        status={isOnline ? "online" : "offline"}
      />
      <MessageContainer messages={messages} />
      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export default ConversationContainer;
