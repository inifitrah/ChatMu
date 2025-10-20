import React from "react";
import { cn } from "@chatmu/ui";

interface MessageProps {
  isCurrentUser?: boolean;
  message: string;
  className?: string;
}

const Message: React.FC<MessageProps> = ({
  isCurrentUser,
  message,
  className,
}) => {
  return (
    <div className={cn("w-full", className)}>
      <div
        className={cn(
          "w-full flex px-2",
          isCurrentUser && "justify-end text-end"
        )}
      >
        <div className="rounded-xl overflow-hidden max-w-xs">
          <div
            className={cn("bg-violet-200 p-3", isCurrentUser && "bg-blue-200")}
          >
            <p className="text-black">{message}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message;
