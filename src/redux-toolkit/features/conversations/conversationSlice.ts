import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  conversation: [],
  selectedConversation: {
    id: null,
  },
};
const conversationSlice = createSlice({
  name: "conversation",
  initialState,
  reducers: {
    setSelectedConversation(state, action) {
      state.selectedConversation = action.payload;
    },
    clearSelectedConversation(state) {
      state.selectedConversation = initialState.selectedConversation;
    },
  },
});

export const { setSelectedConversation, clearSelectedConversation } =
  conversationSlice.actions;

export default conversationSlice.reducer;
