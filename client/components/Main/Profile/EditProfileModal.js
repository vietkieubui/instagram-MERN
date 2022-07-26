import React, { useState, useEffect } from "react";
import { Modal, View, Text, Alert } from "react-native";
import { Input, Button } from "react-native-elements";
import { FONTS } from "./../../../assets/constants";
import { useSelector, useDispatch } from "react-redux";
import authSlice, { loadUser } from "../../Auth/AuthSlice";
import { apiUrl } from "./../../../assets/constants";
import axios from "axios";

export default function EditProfileModal({ showEditModal, setShowEditModal }) {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [updatedUser, setUpdatedUser] = useState(user);
  useEffect(() => {
    setUpdatedUser(user);
  }, []);
  const { name, bio } = updatedUser;

  const onClose = () => {
    setShowEditModal(false);
  };
  const onUpdate = async () => {
    console.log(name, bio);
    try {
      const response = await axios.put(`${apiUrl}/user/edit`, { name, bio });
      if (response.data.success) {
        console.log("thanh cong");

        dispatch(
          authSlice.actions.setAuth({
            isAuthenticated: true,
            user: response.data.user,
          })
        );
        dispatch(loadUser());
        Alert.alert("Success!", response.data.message, [
          { text: "OK", onPress: setShowEditModal.bind(this, false) },
        ]);
        // setShowEditModal(false);
        return response.data;
      }
    } catch (error) {
      Alert.alert("Error!");
      console.log(error);
      return error.response.data
        ? error.response.data
        : { success: false, message: "Server Error!" };
    }
  };

  return (
    <Modal visible={showEditModal}>
      <View>
        <Text style={{ ...FONTS.h1, alignSelf: "center" }}>Edit Profile</Text>
        <View style={{ marginLeft: 20 }}>
          <Text style={{ ...FONTS.h3, padding: 10, paddingBottom: 0 }}>
            Name
          </Text>
          <Input
            placeholder="Name"
            value={name}
            onChangeText={(text) =>
              setUpdatedUser({ ...updatedUser, name: text })
            }
          />
          <Text style={{ ...FONTS.h3, padding: 10, paddingBottom: 0 }}>
            Bio
          </Text>
          <Input
            placeholder="Bio"
            value={bio}
            onChangeText={(text) =>
              setUpdatedUser({ ...updatedUser, bio: text })
            }
          />
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
          <Button title="Update" onPress={onUpdate} />
          <Button
            title="Cancel"
            buttonStyle={{ backgroundColor: "#FF0000" }}
            onPress={onClose}
          />
        </View>
      </View>
    </Modal>
  );
}
