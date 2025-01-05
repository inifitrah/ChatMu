import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getConversation, saveNewMessage } from "@/app/actions/chatActions";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import { useSocketContext } from "@/contexts/SocketContext";
import ConversationHeader from "./ConversationHeader";
import MessageContainer from "./MessageContainer";
import MessageInput from "./MessageInput";
import { useDispatch, useSelector } from "react-redux";
import { clearSelectedConversation } from "@/redux-toolkit/features/conversations/conversationSlice";

interface Message {
  content: string;
  type: "text" | "server";
  isCurrentUser: boolean;
}

interface IReceiveMessage {
  chatId: string;
  sender: { id: string; username: string };
  recipient: { id: string; username: string };
  content: string;
  type: string;
}

interface IConversation {
  id: "string";
  username: string;
  profileImage?: string;
  messages?: Message[];
}

const ConversationContainer = () => {
  const { socket, isConnected } = useSocketContext();
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversation, setConversation] = useState<IConversation>();
  const selectedConversation = useSelector(
    (state) => state.conversation.selectedConversation
  );
  const dispatch = useDispatch();
  const { toast } = useToast();

  const handleSendMessage = (newMessage: string) => {
    setMessages([
      ...messages,
      { content: newMessage, isCurrentUser: true, type: "text" },
    ]);
    socket?.emit("message", {
      chatId: selectedConversation.id,
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
    if (selectedConversation.id && session?.user.id) {
      saveNewMessage(selectedConversation.id, session?.user.id, newMessage);
    }
  };

  const fetchConversation = useCallback(async () => {
    if (selectedConversation.id && session?.user.id) {
      const conversation = await getConversation(
        selectedConversation.id,
        session?.user.id
      );
      setMessages([...conversation.messages]);
      setConversation(conversation);
    }
  }, [selectedConversation.id, session]);

  useEffect(() => {
    fetchConversation();
  }, [fetchConversation]);

  useEffect(() => {
    if (isConnected) {
      socket?.on("receiveMessage", (receiveMessage: IReceiveMessage) => {
        const { content, type } = receiveMessage;
        setMessages([
          ...messages,
          {
            content,
            isCurrentUser: false,
            type: type as "text",
          },
        ]);
      });
    }
  }, [messages, socket, isConnected, session]);

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
