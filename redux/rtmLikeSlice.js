import { createSlice } from "@reduxjs/toolkit";

const rtmLikeSlice = createSlice({
  name: "rtmLike",
  initialState: {
    likeNotify: [],
  },
  reducers: {
    setLikeNotify: (state, action) => {
      if (action.payload.type === "like") {
        state.likeNotify.push(action.payload);
      } else if (action.payload.type === "dislike") {
        state.likeNotify = state.likeNotify.filter(
          (item) => item.userId !== action.payload.userId
        );
      }
    },
    clearLikeNotify: (state) => {
      state.likeNotify = [];
    },
  },
});

export const { setLikeNotify, clearLikeNotify } = rtmLikeSlice.actions;
export default rtmLikeSlice.reducer;
