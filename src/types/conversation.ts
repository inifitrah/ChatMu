export interface IConversation {
  id: string;
  otherUserId: string;
  profileImage: string;
  username: string;
  message: {
    isCurrentUser: boolean;
    lastMessageTime: Date;
    lastMessageContent: string;
    unreadMessageCount: number;
    status: "sent" | "delivered" | "read";
  };
}

export interface ISelectedConversation {
  id: string | undefined;
  userId: string | undefined;
  username: string | undefined;
  profileImage: string | undefined;
}
