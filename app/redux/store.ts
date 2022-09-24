import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import authSlice from '../components/Auth/AuthSlice';
import userSlice from '../components/Main/Profile/UserSlice';

const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    user: userSlice.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export default store;
