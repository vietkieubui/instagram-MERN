import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Image, Icon } from "react-native-elements";
import { SafeAreaView } from "react-native-safe-area-context";
import { SIZES, images } from "../../../assets/constants";

function FeedScreen(props) {
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
      <ScrollView style={styles.feedContainer}>
        {/* <Post />
        <Post />
        <Post />
        <Post />
        <Post />
        <Post />
        <Post /> */}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: SIZES.width,
  },
  topnav: {
    marginTop: 5,
    marginBottom: 20,
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
