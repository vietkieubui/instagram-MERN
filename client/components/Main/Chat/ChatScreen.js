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
import { Icon, Image, Input } from "react-native-elements";
import { apiUrl, FONTS, SIZES, socket } from "../../../assets/constants";
import { formatDate } from "../../../utils/actions";
import chatSlice, { loadConversations, loadMessages } from "./ChatSlice";
import axios from "axios";

export default function ChatScreen(props) {
  const dispatch = useDispatch();

  const chat = useSelector((state) => state.chat);
  const conversation = useSelector((state) => state.chat.conversation);
  const messages = useSelector((state) => state.chat.messages);

  const [messageText, setMessageText] = useState("");

  useEffect(() => {
    dispatch(chatSlice.actions.setMessagesLoading());
    dispatch(loadMessages(conversation._id));
  }, []);

  useEffect(() => {
    socket.on("receive-message", ({ conversationId }) => {
      if (conversationId === conversation._id) {
        dispatch(loadMessages(conversation._id));
        dispatch(loadConversations());
      }
    });
  }, [messages]);

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
      <ScrollView style={{ maxHeight: SIZES.height - 70 }}>
        {messages.map((message) => (
          <SingleMessage message={message} key={message._id} />
        ))}
      </ScrollView>
    );
  }

  const onSendMessage = async () => {
    try {
      const dataSendMessage = await axios.post(
        `${apiUrl}/chat/message/${conversation._id}`,
        { content: messageText }
      );
      if (dataSendMessage.data.success) {
        socket.emit("send-message", { conversationId: conversation._id });
        setMessageText("");
        dispatch(loadMessages(conversation._id));
        dispatch(loadConversations());
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        width: SIZES.width,
        height: SIZES.height,
        backgroundColor: "#ffffff",
        flexDirection: "column",
      }}
    >
      <View
        style={{
          justifyContent: "space-between",
          flexDirection: "column",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            height: 30,
            backgroundColor: "#eeeeee",
            alignItems: "center",
          }}
        >
          <Icon
            type="antdesign"
            name="arrowleft"
            onPress={() => props.navigation.goBack()}
          />
          <Text style={{ ...FONTS.h4, marginLeft: 20 }}>
            {props.route.params.receiver.username}
          </Text>
        </View>
        <View style={{ alignItems: "flex-end", flexDirection: "column" }}>
          <View style={{ flexDirection: "column" }}>{body}</View>
          <View style={{ flexDirection: "row", height: 30 }}>
            <View style={{ alignItems: "center", flexDirection: "column" }}>
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
                  maxWidth: 340,
                  minWidth: 340,
                }}
              />
            </View>

            <TouchableOpacity disabled={!messageText} onPress={onSendMessage}>
              <Icon
                type="antdesign"
                name="rightcircle"
                color={messageText ? "#0000ff" : "gray"}
                style={{
                  width: 30,
                  height: 30,
                  justifyContent: "center",
                  marginLeft: 8,
                }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
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
              borderWidth: 1,
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
