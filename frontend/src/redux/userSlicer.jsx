import { createSlice } from "@reduxjs/toolkit";

let userSlicer = createSlice({
  name: "auth",
  initialState: {
    authUser: null,
    otherUsers: [],
    selectedUser: null,
    onlineUsers: [],
    selectedPerson: null,
  },
  reducers: {
    setAuthuser: (state, action) => {
      state.authUser = action?.payload;
    },
    setOtherUsers: (state, action) => {
      state.otherUsers = action?.payload;
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action?.payload;
    },
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action?.payload;
    },
    setSelectedPerson: (state, action) => {
      state.selectedPerson = action?.payload;
    },
  },
});

export default userSlicer.reducer;
export let {
  setAuthuser,
  setOtherUsers,
  setSelectedUser,
  setOnlineUsers,
  setSelectedPerson,
} = userSlicer.actions;
