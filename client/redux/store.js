import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../components/Auth/AuthSlice";
import userSlice from "../components/Main/Profile/UserSlice";
import postSlice from "../components/Post/PostSlice";

const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    post: postSlice.reducer,
    user: userSlice.reducer,
  },
});

export default store;
