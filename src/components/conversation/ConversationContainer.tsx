import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  getConversation,
  getMessages,
  saveNewMessage,
} from "@/app/actions/conversationActions";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import { useSocketContext } from "@/contexts/SocketContext";
import ConversationHeader from "./ConversationHeader";
import MessageContainer from "./MessageContainer";
import MessageInput from "./MessageInput";
import { clearSelectedConversation } from "@/redux-toolkit/features/conversations/conversationSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/use-dispatch-selector";

interface Message {
  content: string;
  type: "text" | "server";
  isCurrentUser: boolean;
}

interface IReceiveMessage {
  conversationId: string;
  sender: { id: string; username: string };
  recipient: { id: string; username: string };
  content: string;
  type: string;
}

const ConversationContainer = () => {
  const { socket, listenSendMessage } = useSocketContext();
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const conversation = useAppSelector(
    (state) => state.conversation.selectedConversation
  );

  const dispatch = useAppDispatch();
  const { sendMessage } = useSocketContext();
  const { toast } = useToast();

  const handleSendMessage = (newMessage: string) => {
    setMessages([
      ...messages,
      { content: newMessage, isCurrentUser: true, type: "text" },
    ]);
    sendMessage({
      conversationId: conversation.id,
      sender: {
        id: session?.user.id,
        username: session?.user.username,
      },
      recipient: {
        id: conversation?.id,
        username: conversation?.username,
      },
      content: newMessage,
      type: "text",
    });
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
    if (socket) {
      listenSendMessage((data: IReceiveMessage) => {
        const { conversationId, sender, recipient, content, type } = data;
        if (recipient.id === session?.user.id) {
          setMessages([
            ...messages,
            {
              content,
              isCurrentUser: false,
              type: type as "text",
            },
          ]);
          toast({
            title: `New message from ${sender.username}`,
            description: content,
          });
        }
      });
    }
  }, [messages, socket, session]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white">
      <ConversationHeader
        backButtonClick={() => dispatch(clearSelectedConversation())}
        username={conversation?.username}
        profileImage={conversation?.profileImage}
        status="Online"
      />
      <MessageContainer messages={messages} />
      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export default ConversationContainer;
