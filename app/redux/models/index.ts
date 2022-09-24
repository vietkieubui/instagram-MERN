import store from '../store';

export type RootState = ReturnType<typeof store.getState>;

//authState
export interface AuthState {
  authLoading: boolean;
  isAuthenticated: boolean;
  user: UserModel;
}

export interface UserState {
  user: UserModel;
  userLoading: boolean;
}

export interface UserModel {
  username: string;
  createdAt?: Date;
  name: string;
  avatar: string;
  bio?: string;
}
