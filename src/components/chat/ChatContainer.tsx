import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getConversation, saveNewMessage } from "@/app/actions/chatActions";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import { useSocketContext } from "@/contexts/SocketContext";
import ChatHeader from "./ChatHeader";
import ChatWindow from "./ChatWindow";
import ChatInput from "./ChatInput";

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

const ChatContainer = ({
  selectedConversationId,
  setSelectedConversationId,
}: {
  selectedConversationId: string | null;
  setSelectedConversationId: (id: string | null) => void;
}) => {
  const { socket, isConnected } = useSocketContext();
  const { data: session } = useSession();
  // const { id } = useParams<{ id: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversation, setConversation] = useState<IConversation>();
  const { toast } = useToast();

  const handleSendMessage = (newMessage: string) => {
    setMessages([
      ...messages,
      { content: newMessage, isCurrentUser: true, type: "text" },
    ]);
    socket?.emit("message", {
      chatId: selectedConversationId,
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
    if (selectedConversationId && session?.user.id) {
      saveNewMessage(selectedConversationId, session?.user.id, newMessage);
    }
  };

  const fetchConversation = useCallback(async () => {
    if (selectedConversationId && session?.user.id) {
      const conversation = await getConversation(
        selectedConversationId,
        session?.user.id
      );
      setMessages([...conversation.messages]);
      setConversation(conversation);
    }
  }, [selectedConversationId, session]);

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
      <ChatHeader
        backButtonClick={() => setSelectedConversationId(null)}
        username={conversation?.username}
        profileImage={conversation?.profileImage}
        status="Online"
      />
      <ChatWindow messages={messages} />
      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export default ChatContainer;
