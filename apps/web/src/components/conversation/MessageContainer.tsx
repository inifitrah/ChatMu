import React, { useEffect, useRef } from "react";
import Message from "./Message";
import { IMessage } from "@chatmu/shared";
import { useConversationActions } from "@/contexts/ConversationContext";
import { useSocketContext } from "@/contexts/SocketContext";

interface MessageContainerProps {
  messages?: IMessage[];
}

const MessageContainer: React.FC<MessageContainerProps> = ({ messages }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { retryMessage } = useConversationActions();
  const { retrySendMessage } = useSocketContext();
  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [messages]);

  const handleRetry = (params: {
    tempId: string;
    conversationId: string;
    content: string;
    sender: { id: string; username: string };
    recipient: { id: string; username: string };
  }) => {
    // Retry sending the message
    retrySendMessage({
      ...params,
      type: "text" as const,
      status: "sending",
      timeStamp: Date.now(),
    });
    // Update local state
    retryMessage(params);
  };

  return (
    <div
      ref={ref}
      className="flex flex-1 flex-col bg-background overflow-auto py-5 pb-3"
    >
      {messages && messages.length != 0 ? (
        messages.map((message, index) => {
          const isSameSenderAsPrevious =
            index > 0 &&
            messages[index - 1].isCurrentUser === message.isCurrentUser;
          return (
            <Message
              status={message.status}
              className={isSameSenderAsPrevious ? "mt-1" : "mt-6"}
              key={message.id || message.tempId || index}
              isCurrentUser={message.isCurrentUser}
              message={message.content}
              tempId={message.tempId}
              conversationId={message.conversationId}
              sender={message.sender}
              recipient={message.recipient}
              onRetry={
                message.status === "failed" && message.isCurrentUser
                  ? handleRetry
                  : undefined
              }
            />
          );
        })
      ) : (
        <p className="text-center">No messages</p>
      )}
    </div>
  );
};

export default MessageContainer;
