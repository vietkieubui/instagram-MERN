import React, { useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Image } from "react-native-elements";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { FONTS } from "../../../assets/constants";
import chatSlice, { loadConversations } from "./ChatSlice";
import { formatRelative } from "date-fns";
import { formatDate } from "../../../utils/actions";

const SingleConversation = ({ navigation, conversation }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.user);

  const receiver = conversation.members.filter(
    (user) => user._id !== currentUser._id
  );
  if (receiver.length === 1)
    return (
      <TouchableOpacity
        style={{ flexDirection: "row", margin: 10 }}
        onPress={() => {
          dispatch(chatSlice.actions.setConversation(conversation));
          navigation.navigate("Chat");
        }}
      >
        <View>
          <Image
            source={{ uri: receiver[0].avatar }}
            style={{ width: 40, height: 40, borderRadius: 20, marginTop: 3 }}
          />
        </View>
        <View style={{ paddingLeft: 10 }}>
          <Text style={{ ...FONTS.h4 }}>{receiver[0].username}</Text>
          <Text>{formatDate(conversation.lastMessage)}</Text>
        </View>
      </TouchableOpacity>
    );
};

export default function ConversationsScreen(props) {
  const dispatch = useDispatch();
  const chat = useSelector((state) => state.chat);
  useEffect(() => {
    dispatch(chatSlice.actions.setConversationsLoading());
    dispatch(loadConversations());
  }, []);
  if (chat.conversationsLoading) {
    return (
      <SafeAreaView>
        <Text>Load in ConversationsScreen</Text>
      </SafeAreaView>
    );
  }
  let body = null;
  if (chat.conversations.length === 0) {
    body = (
      <SafeAreaView>
        <Text>Send private messages to a friend or group.</Text>
      </SafeAreaView>
    );
  } else {
    body = (
      <>
        {chat.conversations.map((conversation) => (
          <SingleConversation
            key={conversation._id}
            conversation={conversation}
            navigation={props.navigation}
          />
        ))}
      </>
    );
  }
  return (
    <SafeAreaView>
      <Text>ConversationsScreen</Text>
      {body}
    </SafeAreaView>
  );
}
