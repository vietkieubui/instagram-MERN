import axios from "axios";
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { Icon, Image } from "react-native-elements";
import { useDispatch, useSelector } from "react-redux";
import { apiUrl } from "../../../../assets/constants";
import { loadComments } from "./commentSlice";
import EditCommentModal from "./EditCommentModal";

export default function SingleComment({ comment, postId }) {
  const currentUser = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [showDeleteButton, setShowDeleteButton] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  useEffect(() => {
    // console.log(comment._id);
  }, []);

  const onDeleteComment = async () => {
    Alert.alert("Are you sure?", "Do you really want to delete this comment?", [
      {
        text: "Delete",
        onPress: async () => {
          try {
            const dataDeleteComment = await axios.delete(
              `${apiUrl}/posts/comment/${comment._id}`
            );
            if (dataDeleteComment.data.success) {
              dispatch(loadComments(postId));
              Alert.alert("SUCCESS!", "Comment has been deleted!");
            }
          } catch (error) {
            console.log(error);
          }
        },
      },
      { text: "Cancel", onPress: () => setShowDeleteButton(false) },
    ]);
  };

  return (
    <>
      <EditCommentModal
        comment={comment}
        postId={postId}
        showEditModal={showEditModal}
        setShowEditModal={setShowEditModal}
      />
      <View
        style={{
          marginTop: 5,
          marginBottom: 5,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <Image
            source={{ uri: comment.user.avatar }}
            style={{ width: 30, height: 30 }}
          />
          <Text style={{ marginTop: 4, marginLeft: 5, maxWidth: 320 }}>
            <Text
              style={{
                fontFamily: "Roboto-Black",
                fontWeight: "700",
                fontSize: 16,
              }}
            >
              {comment.user.username}{" "}
            </Text>
            <Text style={{ fontSize: 15 }}>{comment.content}</Text>
          </Text>
        </View>
        {currentUser._id === comment.user._id && (
          <View style={{ width: 50, display: "flex" }}>
            <TouchableOpacity
              onPress={() => setShowDeleteButton(!showDeleteButton)}
            >
              <Icon
                type="entypo"
                name="dots-three-vertical"
                size={20}
                style={{ marginTop: 3 }}
              />
            </TouchableOpacity>

            {showDeleteButton && (
              <View style={{ position: "absolute", marginTop: 25 }}>
                <TouchableOpacity
                  style={{
                    backgroundColor: "gray",
                    width: 50,
                    height: 25,
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 10,
                  }}
                  onPress={() => {
                    setShowEditModal(true);
                    setShowDeleteButton(false);
                  }}
                >
                  <Text>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    backgroundColor: "gray",
                    width: 50,
                    height: 25,
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 10,
                  }}
                  onPress={onDeleteComment}
                >
                  <Text>Delete</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </View>
    </>
  );
}
