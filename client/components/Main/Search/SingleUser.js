import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Image } from "react-native-elements";
import { FONTS, SIZES } from "../../../assets/constants";

export default function SingleUser({
  navigation,
  user,
  setSearchText,
  setUsers,
}) {
  return (
    <View
      style={{
        borderColor: "#FF0000",
        margin: 10,
        // backgroundColor: "FFFFF",
        width: SIZES.width,
      }}
    >
      <TouchableOpacity
        // onPress={() => navigation.navigate("Profile", { user: user })}
        onPress={() => {
          setSearchText("");
          setUsers([]);
          navigation.navigate("Profile", { user: user });
        }}
      >
        <View style={{ flexDirection: "row" }}>
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
    </View>
  );
}
