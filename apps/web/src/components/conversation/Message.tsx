import React from "react";
import { cn } from "@chatmu/ui";
import { Clock, Check, CheckCheck, XCircle, RefreshCw } from "lucide-react";
import { IMessage } from "@chatmu/shared";

interface MessageProps {
  isCurrentUser: IMessage["isCurrentUser"];
  message: IMessage["content"];
  className?: string;
  status: IMessage["status"];
  tempId?: string;
  conversationId?: string;
  sender?: { id: string; username: string };
  recipient?: { id: string; username: string };
  onRetry?: (params: {
    tempId: string;
    conversationId: string;
    content: string;
    sender: { id: string; username: string };
    recipient: { id: string; username: string };
  }) => void;
}

const Message: React.FC<MessageProps> = ({
  isCurrentUser,
  message,
  status,
  className,
  tempId,
  conversationId,
  sender,
  recipient,
  onRetry,
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
            {
                isCurrentUser &&  <span className="flex justify-end mt-1 gap-1">
                  {(() => {
                    switch (status) {
                      case "sending":
                        return <Clock className="w-3 h-3 text-gray-500" />;
                      case "sent":
                        return <Check className="w-3 h-3 text-gray-500" />;
                      case "delivered":
                        return <CheckCheck className="w-3 h-3 text-gray-500" />;
                      case "read":
                        return <CheckCheck className="w-3 h-3 text-blue-600" />;
                      case "failed":
                        return (
                          <div className="flex items-center gap-1">
                            <XCircle className="w-3 h-3 text-red-500" />
                            {onRetry && tempId && conversationId && sender && recipient && (
                              <button
                                onClick={() => onRetry({
                                  tempId,
                                  conversationId,
                                  content: message,
                                  sender,
                                  recipient,
                                })}
                                className="hover:opacity-70 transition-opacity"
                                title="Retry sending message"
                              >
                                <RefreshCw className="w-3 h-3 text-blue-500" />
                              </button>
                            )}
                          </div>
                        );
                      default:
                        return null;
                    }
                  })()}
                </span>
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message;
