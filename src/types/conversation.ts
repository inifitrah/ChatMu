export interface IConversation {
  id: string;
  otherUserId: string;
  profileImage: string;
  username: string;
  message?: {
    isCurrentUser: boolean;
    lastMessageTime: Date;
    lastMessageContent: string;
    unreadMessageCount: number;
    status: "sent" | "delivered" | "read";
  };
}

export interface ISelectedConversation {
  id: string;
  userId: string;
  username: string;
  profileImage: string;
}

export interface IMessage {
  conversationId: string;
  sender: {
    id: string;
    username: string;
  };
  recipient: {
    id: string;
    username: string;
  };
  content: string;
  type: "text" | "image" | "video" | "audio";
  status: "sent" | "delivered" | "read";
  isCurrentUser: boolean;
}
