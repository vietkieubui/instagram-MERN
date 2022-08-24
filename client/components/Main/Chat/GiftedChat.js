import React, { useEffect, useState, useRef } from "react";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import {
  apiUrl,
  FONTS,
  SIZES,
  socket,
  serverUrl,
} from "../../../assets/constants";
import chatSlice, { loadConversations, loadMessages } from "./ChatSlice";
import axios from "axios";
import { GiftedChat } from "react-native-gifted-chat";
import io from "socket.io-client";

export default function GiftedChatScreen(props) {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.user);
  const chat = useSelector((state) => state.chat);
  const conversation = useSelector((state) => state.chat.conversation);
  const messages = useSelector((state) => state.chat.messages);

  const [messageText, setMessageText] = useState("");
  const socketRef = useRef();
  useEffect(() => {
    socket.connect();
    dispatch(chatSlice.actions.setMessagesLoading());
    dispatch(loadMessages(conversation._id));
  }, []);
  useEffect(() => {
    socket.on("message", ({ conversationId }) => {
      if (conversationId === conversation._id) {
        dispatch(loadMessages(conversation._id));
        dispatch(loadConversations());
      }
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  const onSendMessage = async () => {
    try {
      const dataSendMessage = await axios.post(
        `${apiUrl}/chat/message/${conversation._id}`,
        { text: messageText }
      );
      if (dataSendMessage.data.success) {
        dispatch(loadMessages(conversation._id));
        socket.emit("message", {
          conversationId: conversation._id,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (chat.messagesLoading) {
    return (
      <SafeAreaView>
        <Text>Loading in Chat screen</Text>
      </SafeAreaView>
    );
  }
  return (
    <GiftedChat
      messagesContainerStyle={{ backgroundColor: "#ffffff" }}
      messages={messages}
      user={currentUser}
      text={messageText}
      onInputTextChanged={(text) => setMessageText(text)}
      onSend={onSendMessage}
    />
  );
}
