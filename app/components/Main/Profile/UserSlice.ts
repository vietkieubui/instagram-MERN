import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { apiUrl, LOCAL_STORAGE_TOKEN_NAME } from '../../../assets/constants';
import axios from 'axios';
import { RootState, UserModel, UserState } from '../../../redux';

const initialState: UserState = {
  user: {} as UserModel,
  userLoading: true,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state: UserState, action: PayloadAction<UserModel>) => {
      state.userLoading = false;
      state.user = action.payload;
    },
    setDefault: (state, action) => {
      state.user = {} as UserModel;
      state.userLoading = true;
    },
  },
});

export const { setDefault, setUser } = userSlice.actions;

export default userSlice;
