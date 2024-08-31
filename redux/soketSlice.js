import { createSlice } from "@reduxjs/toolkit";

const socketSlice = createSlice({
  name: "socket",
  initialState: {
    isConnected: false,
    connectionId: null,
  },
  reducers: {
    setSocketConnectionStatus: (state, action) => {
      state.isConnected = action.payload;
    },
    setConnectionId: (state, action) => {
      state.connectionId = action.payload;
    },
  },
});

export const { setSocketConnectionStatus, setConnectionId } =
  socketSlice.actions;
export default socketSlice.reducer;
