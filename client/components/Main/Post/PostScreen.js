import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { Button, Icon } from "react-native-elements";
import { SafeAreaView } from "react-native-safe-area-context";
import { apiUrl, FONTS, SIZES } from "./../../../assets/constants";
import axios from "axios";
import postSlice, { loadPost, loadUserPosts } from "../Post/PostSlice";
import { useSelector, useDispatch } from "react-redux";
import { loadComments } from "./Comment/commentSlice";
import SingleComment from "./Comment/SingleComment";

export default function PostScreen(props) {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.user);
  const post = useSelector((state) => state.post.post);
  const comment = useSelector((state) => state.comment);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [liked, setLiked] = useState(false);
  const { user, caption, picture, likes, createdAt, _id } = post;
  const { commentsLoading, comments } = comment;
  let commentsBody = null;
  useEffect(() => {
    dispatch(loadComments(_id));
    setLiked(likes.includes(currentUser._id));
    if (post) {
      Image.getSize(picture, (width, height) =>
        setSize({
          width: SIZES.width - 10,
          height: ((SIZES.width - 10) * height) / width,
        })
      );
    }
  }, [likes]);
  if (!post) {
    return (
      <View>
        <Text>Loading o post</Text>
      </View>
    );
  }

  const [showDeleteButton, setShowDeleteButton] = useState(false);
  const [commentText, setCommentText] = useState("");
  const onLike = async () => {
    try {
      const dataLike = await axios.put(`${apiUrl}/posts/like/${_id}`);
      if (dataLike.data.success) {
        dispatch(loadPost(_id));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deletePost = () => {
    Alert.alert("Are you sure?", "Do you really want to delete this post?", [
      {
        text: "Delete",
        onPress: async () => {
          const dataDeletePost = await axios.delete(`${apiUrl}/posts/${_id}`);
          if (dataDeletePost.data.success) {
            Alert.alert("Success!", "Deleted!", [
              {
                text: "OK",
                onPress: () => {
                  setShowDeleteButton(false);
                  dispatch(loadUserPosts(user._id));
                  props.navigation.navigate("Main");
                },
              },
            ]);
          } else {
            Alert.alert("Failed!", dataDeletePost.data.message);
          }
        },
      },
      { text: "Cancel", onPress: () => setShowDeleteButton(false) },
    ]);
  };
  if (comments.length === 0) {
    commentsBody = (
      <View style={{ alignItems: "center" }}>
        <Text>This post doesn’t have any comment</Text>
      </View>
    );
  } else {
    commentsBody = comments.map((item) => (
      <SingleComment comment={item} postId={post._id} key={item._id} />
    ));
  }

  const onComment = async () => {
    try {
      const dataComment = await axios.post(`${apiUrl}/posts/comment/${_id}`, {
        content: commentText,
      });
      if (dataComment.data.success) {
        setCommentText("");
        dispatch(loadComments(_id));
      }
    } catch (error) {}
  };

  return (
    <View style={styles.postContainer}>
      <ScrollView>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <TouchableOpacity
            style={styles.userPostHeader}
            onPress={() =>
              props.navigation.navigate("Profile", {
                user: post.user,
              })
            }
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
          {user._id === currentUser._id && (
            <View style={{ width: 50, display: "flex" }}>
              <Icon
                type="entypo"
                name="dots-three-vertical"
                size={20}
                style={{ marginTop: 5 }}
                onPress={() => setShowDeleteButton(!showDeleteButton)}
              />
              {showDeleteButton && (
                <TouchableOpacity
                  style={{
                    position: "absolute",
                    backgroundColor: "gray",
                    marginTop: 20,
                    width: 50,
                    height: 25,
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 10,
                  }}
                  onPress={deletePost}
                >
                  <Text>Delete</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>

        <Image
          source={{ uri: picture }}
          style={{
            alignSelf: "center",
            width: size.width,
            height: size.height,
          }}
        />
        <View style={styles.postInfo}>
          <View style={styles.communicateIcon}>
            {liked ? (
              <Icon
                type="antdesign"
                name="heart"
                size={24}
                onPress={onLike}
                color="#ff0000"
              />
            ) : (
              <Icon type="antdesign" name="hearto" size={24} onPress={onLike} />
            )}

            <Icon
              type="ionicon"
              name="chatbubble-outline"
              size={24}
              style={{ marginLeft: 10 }}
            />
          </View>
          <Text style={styles.likeCount}>{likes.length} likes</Text>
          <View>
            <View style={{ flexDirection: "row" }}>
              <Image
                source={{ uri: user.avatar }}
                style={{ width: 30, height: 30 }}
              />
              <Text style={{ marginLeft: 5, marginBottom: 7 }}>
                <Text
                  onPress={() =>
                    props.navigation.navigate("Profile", {
                      user: post.user,
                    })
                  }
                  style={{
                    fontFamily: "Roboto-Black",
                    fontWeight: "700",
                    fontSize: 16,
                  }}
                >
                  {`${user.username} `}
                </Text>

                <Text>{caption}</Text>
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.commentContainer}>{commentsBody}</View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            margin: 10,
            width: SIZES.width,
            alignItems: "center",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              width: 40,
              flex: 3,
            }}
          >
            <Image
              source={{ uri: currentUser.avatar }}
              style={{
                width: 30,
                height: 30,
                marginRight: 5,
              }}
            />
            <TextInput
              placeholder="Write a comment..."
              multiline
              value={commentText}
              onChangeText={(text) => setCommentText(text)}
              style={{
                position: "relative",
                height: 30,
                maxWidth: 250,
              }}
            />
          </View>

          <Button
            title="Comment"
            disabled={!commentText}
            style={{
              flex: 1,
            }}
            buttonStyle={{
              height: 40,
              borderRadius: 20,
            }}
            onPress={onComment}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const getSize = (url) => {
  let width = SIZES.width;
  let height =
    (SIZES.width / Image.getSize(url).width) *
    Image.resolveAssetSource(url).height;
  return { width, height };
};

const styles = StyleSheet.create({
  postContainer: { marginTop: 5 },
  userPostHeader: { flexDirection: "row" },
  postImage: {
    flex: 1,
    width: SIZES.width,
    height: SIZES.height,
    aspectRatio: 1 / 1,
  },
  postInfo: { marginLeft: 8, marginRight: 9, marginTop: 5 },
  communicateIcon: { flexDirection: "row" },
  likeCount: { ...FONTS.h5, fontWeight: "700", fontSize: 14 },
  newComment: { flexDirection: "row" },
  commentContainer: {
    margin: 5,
    marginBottom: 10,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "gray",
  },
});
