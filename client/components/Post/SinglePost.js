import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Icon } from "react-native-elements";
import { FONTS, images, SIZES } from "./../../assets/constants";

export default function SinglePost({ post, navigation }) {
  if (!post) {
    return null;
  }
  const { user, caption, picture, likes, createdAt } = post;
  const [size, setSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    Image.getSize(picture, (width, height) =>
      setSize({
        width: SIZES.width,
        height: (SIZES.width * height) / width,
      })
    );
  }, []);
  return (
    <View style={styles.postContainer}>
      <TouchableOpacity
        style={styles.userPostHeader}
        onPress={() => navigation.navigate("Profile", { user: post.user })}
      >
        <Image
          source={images.logo}
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
        <Text style={styles.likeCount}>{likes.length} like</Text>
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
        <Text style={{ color: "#888888" }}>Xem tat ca 100 comments</Text>
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
