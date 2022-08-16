import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiUrl, LOCAL_STORAGE_TOKEN_NAME } from "../../../assets/constants";
import axios from "axios";

const initialState = {
  user: null,
  userLoading: true,
};

export const loadUserInfor = createAsyncThunk(
  "user/loadUserInfor",
  async (id) => {}
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.userLoading = false;
    },
    setDefault: (state, action) => {
      state.user = null;
      state.userLoading = true;
    },
  },
});

export default userSlice;
