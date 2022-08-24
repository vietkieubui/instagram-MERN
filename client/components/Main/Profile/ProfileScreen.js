import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Button, Icon, Image } from "react-native-elements";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  FONTS,
  SIZES,
  COLORS,
  LOCAL_STORAGE_TOKEN_NAME,
  apiUrl,
  socket,
} from "./../../../assets/constants";
import { useSelector, useDispatch } from "react-redux";
import { loadUser } from "../../Auth/AuthSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import EditProfileModal from "./Modals/EditProfileModal";
import postSlice, { loadUserPosts } from "../../Main/Post/PostSlice";
import followSlice, { loadUserFollow } from "../../Follow/FollowSlice";
import axios from "axios";
import FollowingsModal from "./Modals/FollowingsModal";
import FollowersModal from "./Modals/FollowersModal";
import chatSlice from "../Chat/ChatSlice";

function ProfileScreen(props) {
  const dispatch = useDispatch();

  const auth = useSelector((state) => state.auth);
  const currentUser = useSelector((state) => state.auth.user);
  const postsData = useSelector((state) => state.post);
  const follow = useSelector((state) => state.follow);
  const userPostsData = useSelector((state) => state.post.userPosts);
  const setLoading = () => {
    dispatch(postSlice.actions.setPostsLoading());
    dispatch(followSlice.actions.setFollowLoading());
    dispatch(chatSlice.actions.setDefault());
  };

  useEffect(() => {
    setLoading();
    dispatch(loadUserPosts(props.route.params.user._id));
    dispatch(
      loadUserFollow({
        userId: props.route.params.user._id,
        currentUserId: auth.user._id,
      })
    );
  }, [props.route.params.user._id]);

  const [showEditModal, setShowEditModal] = useState(false);
  const [showFollowingsModal, setShowFollowingsModal] = useState(false);
  const [showFollowersModal, setShowFollowersModal] = useState(false);

  if (postsData.postsLoading || follow.followLoading) {
    return (
      <View>
        <Text>Loading o Profile Screen</Text>
      </View>
    );
  }

  const onLogout = async () => {
    await AsyncStorage.removeItem(LOCAL_STORAGE_TOKEN_NAME);
    dispatch(loadUser());
    setLoading();
    socket.disconnect();
    props.navigation.navigate("Landing");
  };

  const onFollow = async () => {
    try {
      const dataFollow = await axios.post(
        `${apiUrl}/follow/${props.route.params.user._id}`
      );
      if (dataFollow.data.success) {
        dispatch(
          loadUserFollow({
            userId: props.route.params.user._id,
            currentUserId: auth.user._id,
          })
        );
      }
    } catch (error) {}
  };

  const onMessage = async () => {
    const members = [currentUser._id, props.route.params.user._id];
    try {
      const dataCreateConversation = await axios.post(
        `${apiUrl}/chat/conversation`,
        { members }
      );
      if (dataCreateConversation.data.success) {
        dispatch(
          chatSlice.actions.setConversation(
            dataCreateConversation.data.conversation
          )
        );
        props.navigation.navigate("Chat", {
          receiver: props.route.params.user,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <EditProfileModal
          {...props}
          showEditModal={showEditModal}
          setShowEditModal={setShowEditModal}
        />
        <FollowingsModal
          {...props}
          followings={follow.followings}
          showFollowingsModal={showFollowingsModal}
          setShowFollowingsModal={setShowFollowingsModal}
        />
        <FollowersModal
          {...props}
          followers={follow.followers}
          showFollowersModal={showFollowersModal}
          setShowFollowersModal={setShowFollowersModal}
        />
        <View style={styles.container}>
          <View style={styles.topnav}>
            <Text
              style={{
                ...FONTS.h4,
                fontWeight: "700",
                marginLeft: 18,
                marginTop: 8,
              }}
            >
              {props.route.params.user.username}
            </Text>
            {props.route.params.user._id === auth.user._id ? (
              <View
                style={{
                  width: 68,
                  justifyContent: "space-between",
                  flexDirection: "row",
                  marginRight: 6,
                  marginTop: 6,
                }}
              >
                <Icon
                  type="antdesign"
                  name="plussquareo"
                  size={24}
                  onPress={() => console.log("add Post")}
                />
                <Icon
                  type="material-community"
                  name="logout"
                  size={24}
                  onPress={onLogout}
                />
              </View>
            ) : null}
          </View>
          <View style={styles.userFollowData}>
            <Image
              source={{ uri: props.route.params.user.avatar }}
              style={{
                width: 88,
                height: 88,
                marginLeft: 18,
                borderRadius: 44,
              }}
            />
            <View style={styles.followContainer}>
              <View>
                <Text
                  style={{
                    fontFamily: "Roboto-Medium",
                    fontWeight: "700",
                    fontSize: 18,
                    alignSelf: "center",
                  }}
                >
                  {userPostsData.length}
                </Text>
                <Text
                  style={{
                    fontFamily: "Roboto-Medium",
                    fontWeight: "400",
                    fontSize: 18,
                  }}
                >
                  Posts
                </Text>
              </View>
              <TouchableOpacity
                onPress={setShowFollowersModal.bind(this, true)}
              >
                <Text
                  style={{
                    fontFamily: "Roboto-Medium",
                    fontWeight: "700",
                    fontSize: 18,
                    alignSelf: "center",
                  }}
                >
                  {follow.followers.length}
                </Text>
                <Text
                  style={{
                    fontFamily: "Roboto-Medium",
                    fontWeight: "400",
                    fontSize: 18,
                  }}
                >
                  Followers
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={setShowFollowingsModal.bind(this, true)}
              >
                <Text
                  style={{
                    fontFamily: "Roboto-Medium",
                    fontWeight: "700",
                    fontSize: 18,
                    alignSelf: "center",
                  }}
                >
                  {follow.followings.length}
                </Text>
                <Text
                  style={{
                    fontFamily: "Roboto-Medium",
                    fontWeight: "400",
                    fontSize: 18,
                  }}
                >
                  Followings
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <Text style={{ marginTop: 5, marginLeft: 15, ...FONTS.h5 }}>
            {props.route.params.user.name}
          </Text>
          <Text
            style={{
              fontFamily: "Roboto-Medium",
              fontSize: 15,
              marginLeft: 15,
            }}
          >
            {props.route.params.user.bio}
          </Text>
          {props.route.params.user._id === auth.user._id ? (
            <Button
              title="Edit Profile"
              buttonStyle={{
                marginLeft: 15,
                marginRight: 15,
                borderRadius: 10,
                backgroundColor: "#FFFFFF",
                borderColor: "#CBCBCB",
                borderWidth: 2,
                borderStyle: "solid",
              }}
              titleStyle={{ color: "#000000", fontSize: 15 }}
              onPress={setShowEditModal.bind(this, true)}
            />
          ) : (
            <View style={styles.buttonGroup}>
              <Button
                title={follow.followed ? "Following" : "Follow"}
                onPress={onFollow}
                style={{ flex: 1 }}
                buttonStyle={
                  follow.followed
                    ? {
                        marginLeft: 15,
                        borderRadius: 10,
                        backgroundColor: "#FFFFFF",
                        borderColor: "#CBCBCB",
                        borderWidth: 2,
                        borderStyle: "solid",
                        width: 160,
                      }
                    : {
                        marginLeft: 15,
                        borderRadius: 10,
                        backgroundColor: COLORS.primary,
                        borderColor: "#CBCBCB",
                        borderWidth: 2,
                        borderStyle: "solid",
                        width: 160,
                      }
                }
                titleStyle={
                  follow.followed
                    ? { color: "#000000", fontSize: 15 }
                    : { color: "#FFFFFF", fontSize: 15 }
                }
              />

              <Button
                title="Message"
                style={{ flex: 1 }}
                buttonStyle={{
                  marginRight: 15,
                  borderRadius: 10,
                  backgroundColor: "#FFFFFF",
                  borderColor: "#CBCBCB",
                  borderWidth: 2,
                  borderStyle: "solid",
                  width: 160,
                }}
                titleStyle={{ color: "#000000", fontSize: 15 }}
                onPress={onMessage}
              />
            </View>
          )}
        </View>
        <View>
          <View
            style={{ marginTop: 20, flexDirection: "row", flexWrap: "wrap" }}
          >
            {userPostsData.length === 0
              ? null
              : userPostsData.map((item) => (
                  <TouchableOpacity
                    style={{
                      width: (SIZES.width - 12) / 3,
                      margin: 2,
                    }}
                    key={item._id}
                    onPress={() => {
                      dispatch(postSlice.actions.setPost({ post: item }));
                      props.navigation.navigate("Post");
                    }}
                  >
                    <Image
                      style={styles.image}
                      source={{ uri: item.picture }}
                    />
                  </TouchableOpacity>
                ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { width: SIZES.width },
  topnav: {
    marginTop: 5,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    height: 36,
  },
  userFollowData: { flexDirection: "row" },
  followContainer: {
    marginLeft: 10,
    marginTop: 18,
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingTop: 10,
  },
  containerGallery: {
    // flex: 1,
    marginTop: 20,
  },
  containerImage: {
    margin: 1,
    flex: 1 / 3,
  },
  image: {
    flex: 1,
    // width: SIZES.width,
    aspectRatio: 1 / 1,
  },
});

export default ProfileScreen;
