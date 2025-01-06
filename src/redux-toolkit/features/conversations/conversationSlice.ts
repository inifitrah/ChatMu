import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  conversations: [],
  selectedConversation: {
    id: "",
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
} = conversationSlice.actions;

export default conversationSlice.reducer;
