import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import postsSlice from "./postsSlice";
import chatSlice from "./chatSlice";
import socketSlice from "./soketSlice";
import rtmLikeSlice from "./rtmLikeSlice";
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
const persistConfig = {
  key: "root",
  version: 1,
  storage: AsyncStorage,
};

const rootReducer = combineReducers({
  auth: authSlice,
  posts: postsSlice,
  chat: chatSlice,
  socket: socketSlice,
  rtmLikeNotify: rtmLikeSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});
