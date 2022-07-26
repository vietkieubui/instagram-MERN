import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../components/Auth/AuthSlice";

const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
  },
});

export default store;
