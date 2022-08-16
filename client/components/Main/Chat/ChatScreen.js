import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { Icon, Image } from "react-native-elements";
import { apiUrl, SIZES } from "../../../assets/constants";
import { formatDate } from "../../../utils/actions";
import chatSlice, { loadConversations, loadMessages } from "./ChatSlice";
import axios from "axios";

export default function ChatScreen() {
  const dispatch = useDispatch();

  const chat = useSelector((state) => state.chat);
  const conversation = useSelector((state) => state.chat.conversation);
  const messages = useSelector((state) => state.chat.messages);

  const [messageText, setMessageText] = useState("");

  useEffect(() => {
    dispatch(chatSlice.actions.setMessagesLoading());
    dispatch(loadMessages(conversation._id));
  }, []);
  if (chat.messagesLoading) {
    return (
      <SafeAreaView>
        <Text>Loading in CHat screen</Text>
      </SafeAreaView>
    );
  }
  let body = null;
  if (messages.length === 0) {
    body = (
      <View style={{ alignItems: "center", marginBottom: 50 }}>
        <Text>This conversation has no messages yet!</Text>
      </View>
    );
  } else {
    body = (
      <>
        {messages.map((message) => (
          <SingleMessage message={message} key={message._id} />
        ))}
      </>
    );
  }

  const onSendMessage = async () => {
    try {
      const dataSendMessage = await axios.post(
        `${apiUrl}/chat/message/${conversation._id}`,
        { content: messageText }
      );
      if (dataSendMessage.data.success) {
        setMessageText("");
        dispatch(loadMessages(conversation._id));
        dispatch(loadConversations());
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView style={{}}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{
          height: SIZES.height,
          justifyContent: "space-between",
          flexDirection: "column",
        }}
      >
        <Text>CHat screen</Text>
        <View>
          <ScrollView>{body}</ScrollView>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 20,
            }}
          >
            <TextInput
              placeholder="Aa"
              multiline
              value={messageText}
              onChangeText={(text) => setMessageText(text)}
              style={{
                height: 30,
                marginLeft: 10,
                borderColor: "#a1a5ad",
                borderWidth: 1,
                flex: 49 / 50,
              }}
            />
            <TouchableOpacity disabled={!messageText} onPress={onSendMessage}>
              <Icon
                type="antdesign"
                name="rightcircle"
                color={messageText ? "#0000ff" : "gray"}
                style={{
                  width: 30,
                  height: 30,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const SingleMessage = ({ message }) => {
  const dispatch = useDispatch();
  const [showDetail, setShowDetail] = useState(false);
  const currentUser = useSelector((state) => state.auth.user);
  if (message.user._id === currentUser._id) {
    return (
      <View style={{ alignSelf: "flex-end", marginBottom: 20 }}>
        <Text
          style={{
            backgroundColor: "#0000ff",
            color: "#ffffff",
            paddingLeft: 15,
            paddingRight: 15,
            paddingTop: 5,
            paddingBottom: 5,
            maxWidth: SIZES.width / 2,
            borderRadius: 10,
          }}
          onPress={setShowDetail.bind(this, !showDetail)}
        >
          {message.content}
        </Text>
        <View>
          {showDetail && <Text>{formatDate(message.createdAt)}</Text>}
        </View>
      </View>
    );
  } else {
    return (
      <View
        style={{
          alignSelf: "flex-start",
          marginBottom: 20,
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <Image
            source={{ uri: message.user.avatar }}
            style={{ width: 30, height: 30 }}
          />
          <Text
            style={{
              backgroundColor: "#ffffff",
              color: "#000000",
              marginLeft: 5,
              paddingLeft: 15,
              paddingRight: 15,
              paddingTop: 5,
              paddingBottom: 5,
              maxWidth: SIZES.width / 2,
              borderRadius: 10,
            }}
            onPress={setShowDetail.bind(this, !showDetail)}
          >
            {message.content}
          </Text>
        </View>
        {showDetail && (
          <Text style={{ marginLeft: 35 }}>
            {formatDate(message.createdAt)}
          </Text>
        )}
      </View>
    );
  }
};
