import { formatLastMessageTime } from "@/utils/formatLastMessageTime";
import ConversationCard from "@/components/conversation/ConversationCard";

interface IConversation {
  otherUserId: string;
  profileImage: string;
  username: string;
  lastMessageTime: Date;
  lastMessageContent: string;
  unreadMessageCount: number;
  status: "sent" | "delivered" | "read";
}

interface ConversationListItemsProps {
  conversations: IConversation[];
  onOpenChat: (otherUserId: string) => void;
}

const ConversationListItems: React.FC<ConversationListItemsProps> = ({
  conversations,
  onOpenChat,
}) => {
  return (
    <>
      {conversations.map((c: IConversation) => (
        <ConversationCard
          status={c.status}
          onOpenChat={onOpenChat}
          key={c.otherUserId}
          otherUserId={c.otherUserId}
          profileImage={c.profileImage}
          username={c.username}
          lastMessageTime={formatLastMessageTime(c.lastMessageTime || "")}
          lastMessageContent={c.lastMessageContent || ""}
          unreadMessageCount={c.unreadMessageCount || 0}
        />
      ))}
    </>
  );
};

export default ConversationListItems;
