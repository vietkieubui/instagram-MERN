import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiUrl } from "./../../../assets/constants";
import axios from "axios";
import { ActionSheetIOS } from "react-native";

const initialState = {
  conversations: [],
  messages: [],
  conversation: null,
  conversationsLoading: true,
  messagesLoading: true,
};

export const loadConversations = createAsyncThunk(
  "chat/loadConversations",
  async () => {
    try {
      const dataLoadConversations = await axios.get(
        `${apiUrl}/chat/conversation`
      );
      if (dataLoadConversations.data.success) {
        return {
          conversations: dataLoadConversations.data.conversations,
          conversationsLoading: false,
        };
      }
    } catch (error) {
      console.log(error);
    }
  }
);

export const loadMessages = createAsyncThunk(
  "chat/loadMessages",
  async (conversationId) => {
    try {
      const dataLoadMessages = await axios.get(
        `${apiUrl}/chat/conversation/${conversationId}`
      );
      if (dataLoadMessages.data.success) {
        return {
          messages: dataLoadMessages.data.conversationMessages,
          messagesLoading: false,
        };
      }
    } catch (error) {
      console.log(error);
    }
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setConversation: (state, action) => {
      state.conversation = action.payload;
    },
    setConversationsLoading: (state, action) => {
      state.conversationsLoading = true;
    },
    setMessagesLoading: (state, action) => {
      state.messagesLoading = true;
    },
    setDefault: (state, action) => {
      state.conversations = [];
      state.messages = [];
      state.conversation = null;
      state.conversationsLoading = true;
      state.messagesLoading = true;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadConversations.fulfilled, (state, action) => {
      state.conversations = action.payload.conversations;
      state.conversationsLoading = action.payload.conversationsLoading;
    });
    builder.addCase(loadMessages.fulfilled, (state, action) => {
      state.messages = action.payload.messages;
      state.messagesLoading = action.payload.messagesLoading;
    });
  },
});

export default chatSlice;
