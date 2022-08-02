import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Button, Icon, Image } from "react-native-elements";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  FONTS,
  SIZES,
  COLORS,
  LOCAL_STORAGE_TOKEN_NAME,
} from "./../../../assets/constants";
import { useSelector, useDispatch } from "react-redux";
import { loadUser } from "../../Auth/AuthSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import EditProfileModal from "./EditProfileModal";
import { loadPosts, loadUserPosts } from "../../Post/PostSlice";

function ProfileScreen(props) {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const postsData = useSelector((state) => state.post);
  const userPostsData = useSelector((state) => state.post.userPosts);

  useEffect(() => {
    dispatch(loadUser());
    dispatch(loadPosts());
    dispatch(loadUserPosts(props.route.params.user._id));
  }, [props.route.params.user._id]);
  const [showEditModal, setShowEditModal] = useState(false);

  const onLogout = async () => {
    await AsyncStorage.removeItem(LOCAL_STORAGE_TOKEN_NAME);
    dispatch(loadUser());
    props.navigation.navigate("Landing");
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <EditProfileModal
          showEditModal={showEditModal}
          setShowEditModal={setShowEditModal}
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
              <View>
                <Text
                  style={{
                    fontFamily: "Roboto-Medium",
                    fontWeight: "700",
                    fontSize: 18,
                    alignSelf: "center",
                  }}
                >
                  {/* {followersList.length} */}0
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
              </View>
              <View>
                <Text
                  style={{
                    fontFamily: "Roboto-Medium",
                    fontWeight: "700",
                    fontSize: 18,
                    alignSelf: "center",
                  }}
                >
                  {/* {followingList.length} */}0
                </Text>
                <Text
                  style={{
                    fontFamily: "Roboto-Medium",
                    fontWeight: "400",
                    fontSize: 18,
                  }}
                >
                  Following
                </Text>
              </View>
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
              {
                /*following*/ false ? (
                  <Button
                    title="Following"
                    style={{ flex: 1 }}
                    buttonStyle={{
                      marginLeft: 15,
                      borderRadius: 10,
                      backgroundColor: "#FFFFFF",
                      borderColor: "#CBCBCB",
                      borderWidth: 2,
                      borderStyle: "solid",
                      width: 160,
                    }}
                    titleStyle={{ color: "#000000", fontSize: 15 }}
                  />
                ) : (
                  <Button
                    title="Follow"
                    style={{ flex: 1 }}
                    buttonStyle={{
                      marginLeft: 15,
                      borderRadius: 10,
                      backgroundColor: COLORS.primary,
                      borderColor: "#CBCBCB",
                      borderWidth: 2,
                      borderStyle: "solid",
                      width: 160,
                    }}
                    titleStyle={{ color: "#FFFFFF", fontSize: 15 }}
                  />
                )
              }
              <Button
                title="Messenger"
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
              />
            </View>
          )}
        </View>
        <View>
          {/* <View style={styles.containerGallery}>
            <FlatList
              numColumns={3}
              scrollEnabled={true}
              horizontal={false}
              data={postsData.posts}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.containerImage}
                  key={item._id}
                  onPress={() => console.log(item._id)}
                >
                  <Image style={styles.image} source={{ uri: item.picture }} />
                </TouchableOpacity>
              )}
            />
            
          </View> */}
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
                    onPress={() =>
                      props.navigation.navigate("Post", { post: item })
                    }
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
