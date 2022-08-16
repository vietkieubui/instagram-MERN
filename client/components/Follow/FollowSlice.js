import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { LOCAL_STORAGE_TOKEN_NAME, apiUrl } from "../../assets/constants";
import axios from "axios";

const initialState = {
  followers: [],
  followings: [],
  followed: false,
  followLoading: true,
};

export const loadUserFollow = createAsyncThunk(
  "follow/loadUserFollow",
  async ({ userId, currentUserId }) => {
    let followings = [];
    let followers = [];
    let followed = false;
    const dataLoadUserFollowings = await axios.get(
      `${apiUrl}/follow/followings/${userId}`
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

      followers = dataLoadUserFollowers.data.followers;
      if (followers.length !== 0) {
        followers.reverse();
        if (followers.find((follower) => follower._id === currentUserId)) {
          followed = true;
        }
      }
      return {
        followings,
        followers,
        followed,
        followLoading: false,
      };
    }
  }
);

const followSlice = createSlice({
  name: "follow",
  initialState,
  reducers: {
    setFollowLoading: (state, action) => {
      state.followLoading = true;
    },
    setDefault: (state, action) => {
      state.followers = [];
      state.followings = [];
      state.followed = false;
      state.followLoading = true;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadUserFollow.fulfilled, (state, action) => {
      state.followLoading = action.payload.followLoading;
      state.followings = action.payload.followings;
      state.followers = action.payload.followers;
      state.followed = action.payload.followed;
    });
  },
});

export default followSlice;
