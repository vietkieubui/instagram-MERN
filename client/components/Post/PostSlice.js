import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { LOCAL_STORAGE_TOKEN_NAME, apiUrl } from "../../assets/constants";
import axios from "axios";
import authSlice from "../Auth/AuthSlice";
import { useSelector, useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import setAuthToken from "../../utils/setAuthToken";

const initialState = {
  post: null,
  posts: [],
  postsLoading: true,
  userPosts: [],
};

export const loadPosts = createAsyncThunk("post/loadPosts", async () => {
  let user = null;
  const accessToken = await AsyncStorage.getItem(LOCAL_STORAGE_TOKEN_NAME);

  if (accessToken) {
    setAuthToken(accessToken);
    const dataLoadUser = await axios.get(`${apiUrl}/auth/user`);

    if (dataLoadUser.data.success) {
      user = dataLoadUser.data.user;
    }
  }
  let data = null;

  const dataLoadPosts = await axios.get(`${apiUrl}/posts/${user._id}`);
  if (dataLoadPosts.data.success) {
    data = dataLoadPosts.data.posts;
    data.reverse();
    return {
      post: null,
      posts: data,
      postsLoading: false,
    };
  }
});

export const loadUserPosts = createAsyncThunk(
  "post/loadUserPosts",
  async (userId) => {
    let data = null;
    const dataLoadUserPosts = await axios.get(`${apiUrl}/posts/${userId}`);
    if (dataLoadUserPosts.data.success) {
      data = dataLoadUserPosts.data.posts;
      data.reverse();
      return {
        // post: null,
        userPosts: data,
        postsLoading: false,
      };
    }
  }
);
//postsFeed
//PostsUser
//Post

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    getPosts: (state, action) => {
      state.postsLoading = false;
      state.posts = action.payload;
    },
    getPostsFail: (state, action) => {
      state.postsLoading = false;
      state.posts = [];
    },
    addPost: (state, action) => {
      state.posts.push(action.payload);
    },
    deletePost: (state, action) => {
      state.posts = state.posts.filter((post) => post._id !== action.payload);
    },
    updatePost: (state, { payload }) => {
      state.posts = state.posts.map((post) =>
        post._id === payload._id ? payload : post
      );
    },
    findPost: (state, { payload }) => {
      state.post = state.posts.find((post) => post._id === payload);
    },
    setPost: (state, action) => {
      state.post = action.payload.post;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadPosts.fulfilled, (state, action) => {
      state.post = action.payload.post;
      state.posts = action.payload.posts;
      state.postsLoading = action.payload.postsLoading;
    });
    builder.addCase(loadUserPosts.fulfilled, (state, action) => {
      state.userPosts = action.payload.userPosts;
      state.postsLoading = action.payload.postsLoading;
    });
  },
});

export default postSlice;
