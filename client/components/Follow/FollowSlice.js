import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { LOCAL_STORAGE_TOKEN_NAME, apiUrl } from "../../assets/constants";
import axios from "axios";

const initialState = {
  followers: [],
  followings: [],
  followLoading: true,
};

export const loadUserFollow = createAsyncThunk(
  "follow/loadUserFollow",
  async (userId) => {
    let followings = null;
    let followers = null;
    const dataLoadUserFollowings = await axios.get(
      `${apiUrl}/follow/followings${userId}`
    );
    const dataLoadUserFollowers = await axios.get(
      `${apiUrl}/follow/followers/${userId}`
    );
    if (
      dataLoadUserFollowings.data.success &&
      dataLoadUserFollowers.data.success
    ) {
      followings = dataLoadUserFollowings.data.followings;
      if (followings.length !== 0) {
        followings.reverse();
      }

      followers = dataLoadUserFollowers.data.follower;
      if (followers.length !== 0) {
        followers.reverse();
      }
      return {
        followings,
        followers,
        followLoading: false,
      };
    }
  }
);

const followSlice = createSlice({
  name: "follow",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loadUserFollow.fulfilled, (state, action) => {
      state.followLoading = action.payload.followLoading;
      state.followings = action.payload.followings;
      state.followers = action.payload.followers;
    });
  },
});

export default followSlice;
