import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { LOCAL_STORAGE_TOKEN_NAME, apiUrl } from "../../assets/constants";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import setAuthToken from "../../utils/setAuthToken";

const initialState = {
  post: null,
  posts: [],
  userPosts: [],
  followingPosts: [],
  postsLoading: true,
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
      if (data.length !== 0) {
        data.reverse();
      }
      return {
        userPosts: data,
        postsLoading: false,
      };
    }
  }
);

export const loadFollowingPosts = createAsyncThunk(
  "post/loadFollowingPosts",
  async (currentUser) => {
    try {
      const dataFollowingPosts = await axios.get(
        `${apiUrl}/posts/followings/${currentUser._id}`
      );
      if (dataFollowingPosts.data.success) {
        let tmpFollowingPost = dataFollowingPosts.data.followingPosts;
        if (tmpFollowingPost.length !== 0) {
          tmpFollowingPost.reverse();
        }
        return {
          followingPosts: tmpFollowingPost,
        };
      }
    } catch (error) {
      console.log(error);
    }
  }
);

const getPosts = async (userId) => {
  const dataPosts = await axios.get(`${apiUrl}/posts/${userId}`);
  if (dataPosts.data.success) {
    return dataPosts.data.posts;
  }
  return null;
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    setPostsLoading: (state, action) => {
      state.postsLoading = true;
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
    builder.addCase(loadFollowingPosts.fulfilled, (state, action) => {
      state.followingPosts = action.payload.followingPosts;
      state.postsLoading = false;
    });
  },
});

export default postSlice;
