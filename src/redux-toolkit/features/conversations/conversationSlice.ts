import { createSlice } from "@reduxjs/toolkit";

interface IConversation {
  id: string;
  otherUserId: string;
  profileImage: string;
  username: string;
  lastMessageTime: Date;
  lastMessageContent: string;
  unreadMessageCount: number;
  status: "sent" | "delivered" | "read";
}
interface IState {
  conversations: IConversation[];
  selectedConversation: {
    id: string;
    userId: string;
    username: string;
    profileImage: string;
  };
}

const initialState: IState = {
  conversations: [],
  selectedConversation: {
    id: "",
    userId: "",
    username: "",
    profileImage: "",
  },
};
const conversationSlice = createSlice({
  name: "conversation",
  initialState,
  reducers: {
    setConversations(state, action) {
      state.conversations = action.payload;
    },
    setLastMessage(state, action) {
      const { conversationId, lastMessageContent, lastMessageTime } =
        action.payload;
      const conversationIndex = state.conversations.findIndex(
        (conversation) => conversation.id === conversationId
      );
      state.conversations[conversationIndex].lastMessageContent =
        lastMessageContent;
      state.conversations[conversationIndex].lastMessageTime = lastMessageTime;
    },
    setSelectedConversation(state, action) {
      state.selectedConversation = action.payload;
    },
    clearSelectedConversation(state) {
      state.selectedConversation = initialState.selectedConversation;
    },
  },
});

export const {
  setSelectedConversation,
  clearSelectedConversation,
  setConversations,
  setLastMessage,
} = conversationSlice.actions;

export default conversationSlice.reducer;
