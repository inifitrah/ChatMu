import React, { useEffect, useRef } from "react";
import Message from "./Message";
import { IMessage } from "@/types/conversation";

interface MessageContainerProps {
  messages?: IMessage[];
}

const MessageContainer: React.FC<MessageContainerProps> = ({ messages }) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [messages]);

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
              className={isSameSenderAsPrevious ? "mt-1" : "mt-6"}
              key={index}
              isCurrentUser={message.isCurrentUser}
              message={message.content}
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
