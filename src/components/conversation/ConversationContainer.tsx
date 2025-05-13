import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useSocketContext } from "@/contexts/SocketContext";
import ConversationHeader from "./ConversationHeader";
import MessageContainer from "./MessageContainer";
import MessageInput from "./MessageInput";
import {
  clearSelectedConversation,
  setConversationStatus,
  setMessage,
} from "@/redux-toolkit/features/conversations/conversationSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/use-dispatch-selector";
import { IMessage, ISelectedConversation } from "@/types/conversation";
import { selectMessageByConversationId } from "@/redux-toolkit/features/conversations/conversationSelectors";
import { shallowEqual } from "react-redux";
interface ConversationContainerProps {
  conversation: ISelectedConversation;
}

const ConversationContainer = ({
  conversation,
}: ConversationContainerProps) => {
  const { socket, markAsRead, listenMarkAsRead, listenMessage } =
    useSocketContext();
  const { data: session } = useSession();

  const { isOnline, messages } = useAppSelector(
    (state) => ({
      messages: selectMessageByConversationId(
        state,
        conversation.id,
        session?.user.id
      ),
      isOnline: state.user.onlineUsers.find(
        (user) => user.userId === conversation.userId
      ),
    }),
    shallowEqual
  );

  const dispatch = useAppDispatch();
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
      type: "text",
      status: "sent",
    };
    sendMessage(messageData);
    dispatch(setMessage(messageData));
    dispatch(
      setConversationStatus({
        conversationId: messageData.conversationId,
        status: messageData.status,
      })
    );
  };

  useEffect(() => {
    if (session && conversation.id) {
      if (
        messages.length > 0 &&
        messages[messages.length - 1].isCurrentUser === false &&
        messages[messages.length - 1].status !== "read"
      ) {
        markAsRead({
          conversationId: conversation.id,
          userId: conversation.userId,
        });
      }

      if (
        socket &&
        messages.length > 0 &&
        messages[messages.length - 1].isCurrentUser === true
      ) {
        listenMarkAsRead((conversationId: string) => {
          dispatch(setConversationStatus({ conversationId, status: "read" }));
        });
      }
    }
  }, [conversation.id, session, messages, socket]);

  return (
    <div className="fixed wrapper-page inset-0 z-50 flex flex-col">
      <ConversationHeader
        backButtonClick={() => dispatch(clearSelectedConversation())}
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
