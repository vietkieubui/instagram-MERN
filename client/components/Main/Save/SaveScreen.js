import React, { useState } from "react";
import { View, Image, Button, Alert } from "react-native";
import { storage } from "./../../../firebase/config";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { Input } from "react-native-elements";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { apiUrl } from "../../../assets/constants";
import { loadUserPosts } from "../../Main/Post/PostSlice";

require("firebase/firestore");
require("firebase/storage");

export default function SaveScreen(props) {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.user);
  // console.log(props.route.params);
  const [caption, setCaption] = useState("");
  const uploadImage = async () => {
    const childPath = `posts/${currentUser._id}/${Math.random().toString(36)}`;
    const uri = props.route.params.image;
    const response = await fetch(uri);
    const blob = await response.blob();
    const storageRef = ref(storage, childPath);
    const uploadTask = uploadBytesResumable(storageRef, blob);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        console.log(error);
      },
      () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        getDownloadURL(uploadTask.snapshot.ref).then((picture) => {
          console.log("File available at", picture);
          savePostData(picture);
        });
      }
    );
  };

  const savePostData = async (picture) => {
    // addPost({ picture, caption });
    if (!picture) {
      Alert.alert("ERROR!", "No Image Found!");
    } else {
      console.log("Uploading....");
      const dataUploadPost = await axios.post(`${apiUrl}/posts`, {
        caption,
        picture,
      });

      if (dataUploadPost.data.success) {
        Alert.alert("Success!", "Uploaded!", [
          {
            text: "OK",
            onPress: () => {
              dispatch(loadUserPosts(currentUser._id));
              props.navigation.navigate("Main");
            },
          },
        ]);
      } else {
        console.log("upload Failed");
      }
    }
  };
  return (
    <SafeAreaView style={{ flex: 1, marginTop: 20 }}>
      <View>
        <Image
          source={{ uri: `${props.route.params.image}` }}
          style={{ height: 200, width: "auto" }}
        />
        <Input
          placeholder="Write somethings...."
          onChangeText={(text) => setCaption(text)}
          inputContainerStyle={{ borderBottomWidth: 0 }}
        />
        <Button title="Save" onPress={uploadImage} />
      </View>
    </SafeAreaView>
  );
}
