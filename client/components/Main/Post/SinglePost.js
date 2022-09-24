import axios from "axios";
import React, { useEffect, useState } from "react";
import { View, Image, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Icon } from "react-native-elements";
import { useDispatch, useSelector } from "react-redux";
import { apiUrl, FONTS, images, SIZES } from "../../../assets/constants";
import LikesListModal from "./Comment/LikesListModal";

import postSlice, { loadFollowingPosts } from "./PostSlice";

export default function SinglePost({ post, navigation }) {
  if (!post) {
    return null;
  }
  const [commentsLen, setCommentsLen] = useState(0);
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.user);

  const [liked, setLiked] = useState(false);
  const [likesList, setLikesList] = useState([]);
  const [showLikesModal, setShowLikesModal] = useState(false);
  const { user, caption, picture, likes, createdAt, _id } = post;

  const [size, setSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    setLiked(likes.includes(currentUser._id));
    countComments();
    getLikesList();
    Image.getSize(picture, (width, height) =>
      setSize({
        width: SIZES.width,
        height: (SIZES.width * height) / width,
      })
    );
  }, [likes]);

  const countComments = async () => {
    try {
      const dataLoadComments = await axios.get(
        `${apiUrl}/posts/comments/${_id}`
      );
      if (dataLoadComments.data.success) {
        setCommentsLen(dataLoadComments.data.comments.length);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getLikesList = async () => {
    try {
      const dataLikesList = await axios.get(`${apiUrl}/posts/likes/${_id}`);
      if (dataLikesList.data.success) {
        setLikesList(dataLikesList.data.likes);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onLike = async () => {
    try {
      const dataLike = await axios.put(`${apiUrl}/posts/like/${_id}`);
      if (dataLike.data.success) {
        dispatch(loadFollowingPosts(currentUser));
        0;
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <View style={styles.postContainer}>
      <LikesListModal
        likes={likesList}
        showLikesModal={showLikesModal}
        setShowLikesModal={setShowLikesModal}
        navigation={navigation}
      />
      <TouchableOpacity
        style={styles.userPostHeader}
        onPress={() => navigation.navigate("Profile", { user: post.user })}
      >
        <Image
          source={{ uri: user.avatar }}
          style={{ width: 30, height: 30, marginLeft: 8 }}
        />
        <Text
          style={{
            fontFamily: "Roboto-Black",
            fontWeight: "700",
            fontSize: 16,
            paddingTop: 4,
            marginLeft: 5,
            marginBottom: 7,
          }}
        >
          {user.username}
        </Text>
      </TouchableOpacity>
      <Image
        source={{ uri: picture }}
        style={{ width: size.width, height: size.height }}
      />
      <View style={styles.postInfo}>
        <View style={styles.communicateIcon}>
          <TouchableOpacity onPress={onLike}>
            {liked ? (
              <Icon type="antdesign" name="heart" color="#ff0000" size={24} />
            ) : (
              <Icon type="antdesign" name="hearto" size={24} />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              dispatch(postSlice.actions.setPost({ post }));
              navigation.navigate("Post");
            }}
          >
            <Icon
              type="ionicon"
              name="chatbubble-outline"
              size={24}
              style={{ marginLeft: 10 }}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={setShowLikesModal.bind(this, true)}>
          <Text style={styles.likeCount}>{likes.length} likes</Text>
        </TouchableOpacity>
        <Text style={{ flexDirection: "row" }}>
          <Text
            style={{
              fontFamily: "Roboto-Black",
              fontWeight: "700",
              paddingRight: 5,
            }}
          >
            {`${user.username} `}
          </Text>
          <Text>{caption}</Text>
        </Text>
        <TouchableOpacity
          onPress={() => {
            dispatch(postSlice.actions.setPost({ post }));
            navigation.navigate("Post");
          }}
        >
          <Text style={{ color: "#888888" }}>
            {`Xem tat ca ${commentsLen} comments`}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  postContainer: { marginBottom: 5 },
  userPostHeader: { flexDirection: "row", marginBottom: 5 },
  postImage: {
    flex: 1,
    width: SIZES.width,
    height: SIZES.height,
    aspectRatio: 1 / 1,
  },
  postInfo: { marginLeft: 12, marginRight: 9, marginTop: 5 },
  communicateIcon: { flex: 1, flexDirection: "row" },
  likeCount: { ...FONTS.h5, fontWeight: "700", fontSize: 14 },
  newComment: { flexDirection: "row" },
});
