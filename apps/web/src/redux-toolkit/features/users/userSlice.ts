import { createSlice } from "@reduxjs/toolkit";
import { OnlineUser } from "@chatmu/shared";

interface InitialState {
  onlineUsers: OnlineUser[];
}

const initialState: InitialState = {
  onlineUsers: [],
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setOnlineUsers(state, action) {
      state.onlineUsers = action.payload;
    },
  },
});

export const { setOnlineUsers } = userSlice.actions;
export default userSlice.reducer;
