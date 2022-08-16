import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { apiUrl } from "../../../../assets/constants";

const initialState = {
  commentsLoading: true,
  comments: [],
};

export const loadComments = createAsyncThunk(
  "comment/loadComments",
  async (postId) => {
    try {
      const dataLoadComments = await axios.get(
        `${apiUrl}/posts/comments/${postId}`
      );
      if (dataLoadComments.data.success) {
        return { comments: dataLoadComments.data.comments };
      }
    } catch (error) {
      console.log(error);
    }
  }
);

const commentSlice = createSlice({
  name: "comment",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loadComments.fulfilled, (state, action) => {
      state.comments = action.payload.comments;
      state.commentsLoading = false;
    });
  },
});

export default commentSlice;
