import React, { useState, useEffect } from "react";
import { View, Text, Alert, TouchableOpacity, ScrollView } from "react-native";
import Modal from "react-native-modal";
import { Input, Button, Image } from "react-native-elements";
import { FONTS, SIZES } from "../../../../assets/constants";

export default function LikesListModal({
  likes,
  navigation,
  showLikesModal,
  setShowLikesModal,
}) {
  let body = null;

  const SingleLike = ({ user }) => {
    return (
      <TouchableOpacity
        style={{ margin: 10, borderColor: "red", borderWidth: 1 }}
        onPress={() => {
          setShowLikesModal(false);
          navigation.navigate("Profile", { user: user });
        }}
      >
        <View style={{ flexDirection: "row", padding: 5 }}>
          <View style={{ marginRight: 10 }}>
            <Image
              style={{ width: 50, height: 50, borderRadius: 50 }}
              source={{ uri: user.avatar }}
            />
          </View>
          <View>
            <Text style={{ ...FONTS.h4, fontWeight: "bold" }}>
              {user.username}
            </Text>
            <Text style={{ ...FONTS.h5, fontWeight: "normal" }}>
              {user.name}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (likes.length === 0) {
    body = (
      <View>
        <Text style={{ alignSelf: "center" }}>No one likes this post!</Text>
      </View>
    );
  } else {
    // console.log(likes);
    body = (
      <View style={{ flexDirection: "column" }}>
        {likes.map((item) => (
          <SingleLike key={item._id} user={item} />
        ))}
      </View>
    );
  }

  const onClose = () => {
    setShowLikesModal(false);
  };

  return (
    <View style={{ flex: 1 }}>
      <Modal isVisible={showLikesModal} onBackdropPress={onClose}>
        <View style={{ backgroundColor: "white" }}>
          <Text style={{ ...FONTS.h1, alignSelf: "center" }}>Likes</Text>
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
