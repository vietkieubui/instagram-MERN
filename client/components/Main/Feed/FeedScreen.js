import React, { useEffect } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Image, Icon } from "react-native-elements";
import { SafeAreaView } from "react-native-safe-area-context";
import { SIZES, images } from "../../../assets/constants";
import SinglePost from "../../Post/SinglePost";
import { useDispatch, useSelector } from "react-redux";
import { loadPosts } from "../../Post/PostSlice";

function FeedScreen(props) {
  const dispatch = useDispatch();
  const postsData = useSelector((state) => state.post);
  const user = useSelector((state) => state.auth.user);
  useEffect(() => {
    dispatch(loadPosts());
  }, []);
  let body = null;
  if (postsData.posts.length === 0 || postsData.postsLoading) {
    body = (
      <View>
        <Text>Chua co post</Text>
      </View>
    );
  } else {
    body = (
      <ScrollView style={styles.feedContainer}>
        {postsData.posts.map((item) => {
          // console.log("user", post.user);
          return (
            <SinglePost
              post={item}
              key={item._id}
              navigation={props.navigation}
            />
          );
        })}
      </ScrollView>
    );
  }
  // console.log(postsData.posts);
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topnav}>
        <Image
          source={images.iglogo}
          style={{ width: 104, height: 30, marginLeft: 15, marginTop: 3 }}
        />
        <View
          style={{
            width: 68,
            justifyContent: "space-between",
            flexDirection: "row",
            marginRight: 6,
            marginTop: 6,
          }}
        >
          <Icon type="antdesign" name="plussquareo" size={24} />
          <Icon type="material-community" name="facebook-messenger" size={24} />
        </View>
      </View>
      {body}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: SIZES.width,
  },
  topnav: {
    marginTop: 5,
    marginBottom: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    height: 36,
  },
  feedContainer: {
    flexDirection: "column",
    // justifyContent: "flex-start",
  },
  postContainer: {},
  userPostHeader: {},
  postImage: {},
  postInfo: {},
  postContribution: {},
  communicateIcon: {},
  postCaption: {},
  newComment: {},
});

const mapStateToProps = (store) => ({
  currentUser: store.user.currentUser,
  posts: store.posts,
});

export default FeedScreen;
