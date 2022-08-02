import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { LOCAL_STORAGE_TOKEN_NAME } from "../../../assets/constants";
import axios from "axios";

const initialState = {
  user: null,
  userLoading: true,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.userLoading = false;
    },
  },
});

export default userSlice;
