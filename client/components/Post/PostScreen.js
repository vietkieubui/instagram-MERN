import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Icon } from "react-native-elements";
import { apiUrl, FONTS, SIZES } from "./../../assets/constants";
import axios from "axios";
import { loadUserPosts } from "../Post/PostSlice";
import { useSelector, useDispatch } from "react-redux";

export default function PostScreen(props) {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.user);
  const [showDeleteButton, setShowDeleteButton] = useState(false);
  if (!props.route.params.post) {
    return null;
  }
  const { user, caption, picture, likes, createdAt, _id } =
    props.route.params.post;
  const [size, setSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    Image.getSize(picture, (width, height) =>
      setSize({
        width: SIZES.width - 10,
        height: ((SIZES.width - 10) * height) / width,
      })
    );
  }, []);

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
      { text: "Cancel" },
    ]);
  };
  return (
    <View style={styles.postContainer}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <TouchableOpacity
          style={styles.userPostHeader}
          onPress={() =>
            props.navigation.navigate("Profile", {
              user: props.route.params.post.user,
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
          <Icon
            type="antdesign"
            name="hearto"
            size={24}
            onPress={() => console.log("press")}
          />
          <Icon
            type="ionicon"
            name="chatbubble-outline"
            size={24}
            style={{ marginLeft: 10 }}
          />
        </View>
        <Text style={styles.likeCount}>{likes.length} likes</Text>
        <Text style={{ flexDirection: "row" }}>
          <Text
            onPress={() =>
              props.navigation.navigate("Profile", {
                user: props.route.params.post.user,
              })
            }
            style={{
              fontFamily: "Roboto-Black",
              fontWeight: "700",
            }}
          >
            {`${user.username} `}
          </Text>

          <Text>{caption}</Text>
        </Text>
        <Text style={{ color: "#888888" }}>Xem tat ca 100 comments</Text>
      </View>
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
  postContainer: { marginBottom: 5, marginTop: 10 },
  userPostHeader: { flexDirection: "row" },
  postImage: {
    flex: 1,
    width: SIZES.width,
    height: SIZES.height,
    aspectRatio: 1 / 1,
  },
  postInfo: { marginLeft: 12, marginRight: 9, marginTop: 5 },
  communicateIcon: { flexDirection: "row" },
  likeCount: { ...FONTS.h5, fontWeight: "700", fontSize: 14 },
  newComment: { flexDirection: "row" },
});
