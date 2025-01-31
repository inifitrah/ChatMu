import React, { useEffect, useState } from "react";
import {
  getMessages,
  markMessagesAsRead,
  saveNewMessage,
} from "@/app/actions/conversationActions";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import { useSocketContext } from "@/contexts/SocketContext";
import ConversationHeader from "./ConversationHeader";
import MessageContainer from "./MessageContainer";
import MessageInput from "./MessageInput";
import {
  clearSelectedConversation,
  setConversationStatus,
  setLastMessage,
} from "@/redux-toolkit/features/conversations/conversationSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/use-dispatch-selector";

interface Message {
  content: string;
  type: "text" | "server";
  isCurrentUser: boolean;
  status: "sent" | "delivered" | "read";
}

interface IReceiveMessage {
  conversationId: string;
  sender: { id: string; username: string };
  recipient: { id: string; username: string };
  content: string;
  type: string;
  status: "sent" | "delivered" | "read";
}

const ConversationContainer = () => {
  const {
    socket,
    listenOnlineUsers,
    markAsRead,
    listenMarkAsRead,
    listenSendMessage,
  } = useSocketContext();
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const conversation = useAppSelector(
    (state) => state.conversation.selectedConversation
  );

  const isOnline = useAppSelector((state) =>
    state.user.onlineUsers.find((user) => user.userId === conversation.userId)
  );

  const dispatch = useAppDispatch();
  const { sendMessage } = useSocketContext();
  const { toast } = useToast();

  const handleSendMessage = (newMessage: string) => {
    setMessages([
      ...messages,
      {
        content: newMessage,
        isCurrentUser: true,
        type: "text",
        status: "sent",
      },
    ]);
    sendMessage({
      conversationId: conversation.id,
      sender: {
        id: session?.user.id,
        username: session?.user.username,
      },
      recipient: {
        id: conversation?.userId,
        username: conversation?.username,
      },
      content: newMessage,
      type: "text",
      status: "sent",
    });
    dispatch(
      setConversationStatus({ conversationId: conversation.id, status: "sent" })
    );
    if (conversation.id && session?.user.id && newMessage) {
      saveNewMessage(conversation.id, session?.user.id, newMessage);
    }
  };

  useEffect(() => {
    if (session && conversation?.id) {
      getMessages(conversation.id, session?.user.id).then((data) => {
        setMessages(data);
      });
    }
  }, [conversation]);

  useEffect(() => {
    if (session && conversation.id) {
      if (
        messages.length > 0 &&
        messages[messages.length - 1].isCurrentUser === false &&
        messages[messages.length - 1].status === "sent"
      ) {
        markAsRead({
          conversationId: conversation.id,
          userId: conversation.userId,
        });
      }

      if (socket) {
        listenMarkAsRead((conversationId: string) => {
          dispatch(setConversationStatus({ conversationId, status: "read" }));
          markMessagesAsRead(conversationId, session.user.id);
        });
      }

      return () => {
        if (socket) {
          socket.off("mark_as_read");
        }
      };
    }
  }, [conversation.id, session, messages, socket]);

  useEffect(() => {
    if (socket) {
      listenSendMessage((data: IReceiveMessage) => {
        const { conversationId, sender, recipient, content, type, status } =
          data;
        if (
          recipient.id === session?.user.id &&
          conversationId === conversation.id
        ) {
          setMessages([
            ...messages,
            {
              content,
              isCurrentUser: false,
              type: type as "text",
              status,
            },
          ]);
        }
      });

      if (messages.length > 0) {
        const lastMessage = messages[messages.length - 1];
        dispatch(
          setLastMessage({
            conversationId: conversation.id,
            lastMessageContent: lastMessage.content,
            lastMessageTime: new Date().toString(),
          })
        );
      }
    }
  }, [messages, socket, session, conversation.id]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white">
      <ConversationHeader
        backButtonClick={() => dispatch(clearSelectedConversation())}
        username={conversation?.username}
        profileImage={conversation?.profileImage}
        status={isOnline ? "online" : "offline"}
      />
      <MessageContainer messages={messages} />
      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export default ConversationContainer;
