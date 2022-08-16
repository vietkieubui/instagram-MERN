import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { formatRelative, formatDistance } from "date-fns";
import authSlice from "../components/Auth/AuthSlice";
import chatSlice from "../components/Main/Chat/ChatSlice";
import postSlice from "../components/Main/Post/PostSlice";
import userSlice from "../components/Main/Profile/UserSlice";
import followSlice from "../components/Follow/FollowSlice";

export function formatDate(date) {
  let formattedDate = "";
  let tmpDate = new Date(date);
  const seconds = tmpDate.getTime() / 1000;

  if (seconds) {
    formattedDate = formatDistance(new Date(seconds * 1000), new Date());

    formattedDate =
      formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
  }
  return formattedDate + " ago";
}

export const setDefault = () => {
  const dispatch = useDispatch();
  dispatch(authSlice.actions.setDefault());
  dispatch(chatSlice.actions.setDefault());
  dispatch(postSlice.actions.setDefault());
  dispatch(userSlice.actions.setDefault());
  dispatch(followSlice.actions.setDefault());
};
