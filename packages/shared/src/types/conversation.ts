export interface IConversation {
  conversationId: string;
  otherUserId: string;
  profileImage: string;
  username: string;
  message?: {
    isCurrentUser: boolean;
    lastMessageTime: Date;
    lastMessageContent: string;
    unreadMessageCount: number;
    status: "sending" | "sent" | "delivered" | "read" | "failed";
  };
}

export interface ISelectedConversation {
  conversationId: string;
  userId: string;
  username: string;
  profileImage: string;
}

export interface IMessage {
  id?: string;
  tempId?: string;
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
  status: "sending" | "sent" | "delivered" | "read" | "failed";
  isCurrentUser: boolean;
  timeStamp: Date;
}
