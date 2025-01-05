import { formatLastMessageTime } from "@/utils/formatLastMessageTime";
import ConversationCard from "@/components/conversation/ConversationCard";

interface IChat {
  targetId: string;
  profileImage: string;
  username: string;
  lastMessageTime: Date;
  lastMessageContent: string;
  unreadMessageCount: number;
  status: "sent" | "delivered" | "read";
}

interface ConversationListItemsProps {
  chats: IChat[];
  onOpenChat: (targetId: string) => void;
}

const ConversationListItems: React.FC<ConversationListItemsProps> = ({
  chats,
  onOpenChat,
}) => {
  return (
    <>
      {chats.map((chat: IChat) => (
        <ConversationCard
          status={chat.status}
          onOpenChat={onOpenChat}
          key={chat.targetId}
          targetId={chat.targetId}
          profileImage={chat.profileImage}
          username={chat.username}
          lastMessageTime={formatLastMessageTime(chat.lastMessageTime || "")}
          lastMessageContent={chat.lastMessageContent || ""}
          unreadMessageCount={chat.unreadMessageCount || 0}
        />
      ))}
    </>
  );
};

export default ConversationListItems;
