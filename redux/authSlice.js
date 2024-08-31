import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    suggestedUsers: [],
    userProfile: null,
    searchUser: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    setAuthUser: (state, action) => {
      state.user = action.payload;
    },
    setSuggestedUsers: (state, action) => {
      state.suggestedUsers = action.payload;
    },
    setUseProfile: (state, action) => {
      state.userProfile = action.payload;
    },
    followRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    followSuccess: (state, action) => {
      const targetUser = action.payload;
      state.isLoading = false;

      if (
        state.user &&
        targetUser &&
        !state.user.following.includes(targetUser._id)
      ) {
        state.user.following.push(targetUser._id);
      }

      if (
        state.userProfile &&
        targetUser &&
        state.userProfile._id === targetUser._id
      ) {
        state.userProfile.followers.push(state.user._id);
      }
    },
    unfollowSuccess: (state, action) => {
      const targetUser = action.payload;
      state.isLoading = false;

      if (state.user && targetUser) {
        state.user.following = state.user.following.filter(
          (id) => id !== targetUser._id
        );
      }

      if (
        state.userProfile &&
        targetUser &&
        state.userProfile._id === targetUser._id
      ) {
        state.userProfile.followers = state.userProfile.followers.filter(
          (id) => id !== state.user._id
        );
      }
    },
    followFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    setSearchUser: (state, action) => {
      state.searchUser = action.payload;
    },
  },
});

export const {
  setAuthUser,
  setSuggestedUsers,
  setUseProfile,
  followRequest,
  followFailure,
  followSuccess,
  unfollowSuccess,
  setSearchUser,
} = authSlice.actions;

export default authSlice.reducer;
