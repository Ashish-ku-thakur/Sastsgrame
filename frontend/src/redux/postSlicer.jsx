import { createSlice } from "@reduxjs/toolkit";

let postSlicer = createSlice({
  name: "frame",
  initialState: {
    allPosts: [],
    selectPost: null,
    allComments: [],
  },
  reducers: {
    setAllPosts: (state, action) => {
      state.allPosts = action?.payload;
    },
    setSelectPost: (state, action) => {
      state.selectPost = action?.payload;
    },
    setAllComments: (state, action) => {
      state.allComments = action?.payload;
    },
  },
});

export default postSlicer.reducer;
export let { setAllPosts, setSelectPost, setAllComments } = postSlicer.actions;
