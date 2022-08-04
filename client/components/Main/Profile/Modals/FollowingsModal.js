import React, { useState, useEffect } from "react";
import { View, Text, Alert, TouchableOpacity, ScrollView } from "react-native";
import Modal from "react-native-modal";
import { Input, Button, Image } from "react-native-elements";
import { FONTS, SIZES } from "../../../../assets/constants";

export default function FollowingsModal({
  followings,
  navigation,
  showFollowingsModal,
  setShowFollowingsModal,
}) {
  let body = null;

  const SingleFollowing = ({ following }) => {
    return (
      <TouchableOpacity
        style={{ margin: 10, borderColor: "red", borderWidth: 1 }}
        onPress={() => {
          setShowFollowingsModal(false);
          navigation.navigate("Profile", { user: following });
        }}
      >
        <View style={{ flexDirection: "row", padding: 5 }}>
          <View style={{ marginRight: 10 }}>
            <Image
              style={{ width: 50, height: 50, borderRadius: 50 }}
              source={{ uri: following.avatar }}
            />
          </View>
          <View>
            <Text style={{ ...FONTS.h4, fontWeight: "bold" }}>
              {following.username}
            </Text>
            <Text style={{ ...FONTS.h5, fontWeight: "normal" }}>
              {following.name}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (followings.length === 0) {
    body = (
      <View>
        <Text style={{ alignSelf: "center" }}>
          This person haven't followed anyone yet!
        </Text>
      </View>
    );
  } else {
    body = (
      <View style={{ flexDirection: "column" }}>
        {followings.map((item) => (
          <SingleFollowing key={item._id} following={item} />
        ))}
      </View>
    );
  }

  const onClose = () => {
    setShowFollowingsModal(false);
  };

  return (
    <View style={{ flex: 1 }}>
      <Modal isVisible={showFollowingsModal}>
        <View style={{ backgroundColor: "white" }}>
          <Text style={{ ...FONTS.h1, alignSelf: "center" }}>Followings</Text>
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
