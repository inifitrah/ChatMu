import { formatLastMessageTime } from "@/utils/formatLastMessageTime";
import ChatCard from "@/components/chat/ChatCard";

interface IChat {
  targetId: string;
  profileImage: string;
  username: string;
  lastMessageTime: Date;
  lastMessageContent: string;
  unreadMessageCount: number;
}

interface ChatListItemsProps {
  chats: IChat[];
  onOpenChat: (targetId: string) => void;
}

const ChatListItems: React.FC<ChatListItemsProps> = ({ chats, onOpenChat }) => {
  return (
    <>
      {chats.map((chat: IChat) => (
        <ChatCard
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

export default ChatListItems;
