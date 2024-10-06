import { createSlice } from "@reduxjs/toolkit";

let chatSlicer = createSlice({
  name: "chat",
  initialState: {
    socket: null,
    chats: null
  },
  reducers: {
    setChats: (state, action) => {
      state.chats = action?.payload;
    },
    setSocket: (state, action) => {
      state.socket = action?.payload;
    },
  },
});

export default chatSlicer.reducer;
export let { setChats, setSocket } = chatSlicer.actions;
