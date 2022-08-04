import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import Modal from "react-native-modal";
import { Button, Image } from "react-native-elements";
import { FONTS } from "../../../../assets/constants";

export default function FollowersModal({
  followers,
  navigation,
  showFollowersModal,
  setShowFollowersModal,
}) {
  let body = null;

  const SingleFollower = ({ follower }) => {
    return (
      <TouchableOpacity
        style={{ margin: 10, borderColor: "red", borderWidth: 1 }}
        onPress={() => {
          setShowFollowersModal(false);
          navigation.navigate("Profile", { user: follower });
        }}
      >
        <View style={{ flexDirection: "row", padding: 5 }}>
          <View style={{ marginRight: 10 }}>
            <Image
              style={{ width: 50, height: 50, borderRadius: 50 }}
              source={{ uri: follower.avatar }}
            />
          </View>
          <View>
            <Text style={{ ...FONTS.h4, fontWeight: "bold" }}>
              {follower.username}
            </Text>
            <Text style={{ ...FONTS.h5, fontWeight: "normal" }}>
              {follower.name}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (followers.length === 0) {
    body = (
      <View>
        <Text style={{ alignSelf: "center" }}>
          No one is following this person
        </Text>
      </View>
    );
  } else {
    body = (
      <View style={{ flexDirection: "column" }}>
        {followers.map((item) => (
          <SingleFollower key={item._id} follower={item} />
        ))}
      </View>
    );
  }

  const onClose = () => {
    setShowFollowersModal(false);
  };

  return (
    <View style={{ flex: 1 }}>
      <Modal isVisible={showFollowersModal}>
        <View style={{ backgroundColor: "white" }}>
          <Text style={{ ...FONTS.h1, alignSelf: "center" }}>Followers</Text>
          <ScrollView>{body}</ScrollView>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              marginBottom: 20,
            }}
          >
            <Button
              title="Cancel"
              buttonStyle={{ backgroundColor: "#FF0000" }}
              onPress={onClose}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}
