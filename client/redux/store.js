import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import authSlice from "../components/Auth/AuthSlice";
import followSlice from "../components/Follow/FollowSlice";
import userSlice from "../components/Main/Profile/UserSlice";
import postSlice from "../components/Main/Post/PostSlice";
import commentSlice from "../components/Main/Post/Comment/commentSlice";
import chatSlice from "../components/Main/Chat/ChatSlice";

const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    post: postSlice.reducer,
    user: userSlice.reducer,
    follow: followSlice.reducer,
    comment: commentSlice.reducer,
    chat: chatSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
