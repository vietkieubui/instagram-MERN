import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import setAuthToken from '../../utils/setAuthToken';
import { LOCAL_STORAGE_TOKEN_NAME, apiUrl } from '../../assets/constants';
import axios from 'axios';
import { AuthState, UserModel } from '../../redux/models';

export const initialState: AuthState = {
  authLoading: true,
  isAuthenticated: false,
  user: {} as UserModel,
};

export const loadUser = createAsyncThunk('auth/loadUser', async () => {
  let data = null;
  const accessToken = await AsyncStorage.getItem(LOCAL_STORAGE_TOKEN_NAME);
  if (accessToken) {
    setAuthToken(accessToken);
    const dataLoadUser = await axios.get(`${apiUrl}/auth/user`);
    if (dataLoadUser.data.success) {
      data = dataLoadUser.data.user;
      return {
        user: data,
        isAuthenticated: true,
        authLoading: false,
      } as AuthState;
    }
  }
  return {
    user: {} as UserModel,
    isAuthenticated: false,
    authLoading: false,
  } as AuthState;
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, { payload }) => {
      state.isAuthenticated = payload.isAuthenticated;
      state.user = payload.user;
      state.authLoading = false;
    },
    setCurrentUser: (state, action) => {
      state.user = action.payload;
    },
    setDefault: (state, action) => {
      state.isAuthenticated = false;
      state.user = {} as UserModel;
      state.authLoading = true;
    },
  },
  extraReducers: builder => {
    builder.addCase(loadUser.fulfilled, (state, action) => {
      state.user = action.payload.user;
      state.isAuthenticated = action.payload.isAuthenticated;
      state.authLoading = false;
    });
  },
});

export default authSlice;
