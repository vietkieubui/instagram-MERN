import React, { useState, useEffect } from "react";
import { View, Text, Alert } from "react-native";
import Modal from "react-native-modal";
import { Input, Button } from "react-native-elements";
import { FONTS } from "../../../../assets/constants";
import { useSelector, useDispatch } from "react-redux";
import authSlice, { loadUser } from "../../../Auth/AuthSlice";
import { apiUrl } from "../../../../assets/constants";
import axios from "axios";
import { loadComments } from "./commentSlice";

export default function EditCommentModal({
  showEditModal,
  setShowEditModal,
  comment,
  postId,
}) {
  const dispatch = useDispatch();
  const [updatedComment, setUpdatedComment] = useState(comment);
  useEffect(() => {
    setUpdatedComment(comment);
  }, []);
  const { content, _id } = updatedComment;

  const onClose = () => {
    setShowEditModal(false);
  };
  const onUpdate = async () => {
    try {
      const response = await axios.put(
        `${apiUrl}/posts/comment/update/${_id}`,
        { content }
      );
      if (response.data.success) {
        dispatch(loadComments(postId));
        Alert.alert("Success!", response.data.message, [
          {
            text: "OK",
            onPress: () => {
              setShowEditModal(false);
            },
          },
        ]);
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
    <View style={{ flex: 1 }}>
      <Modal isVisible={showEditModal} onBackdropPress={onClose}>
        <View style={{ backgroundColor: "white" }}>
          <Text style={{ ...FONTS.h1, alignSelf: "center" }}>Edit Comment</Text>
          <View style={{ marginLeft: 20 }}>
            <Text style={{ ...FONTS.h3, padding: 10, paddingBottom: 0 }}>
              Content
            </Text>
            <Input
              placeholder="Content"
              value={content}
              onChangeText={(text) =>
                setUpdatedComment({ ...updatedComment, content: text })
              }
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-evenly",
              marginBottom: 20,
            }}
          >
            <Button title="Update" onPress={onUpdate} />
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
