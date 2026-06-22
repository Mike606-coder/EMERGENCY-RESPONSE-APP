import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Message {
  id: string;
  chat_id: string;
  sender_id: string;
  content: string;
  message_type: string;
  created_at: string;
  read_at?: string;
}

interface Chat {
  id: string;
  name?: string;
  chat_type: string;
  last_message?: Message;
  unread_count: number;
}

interface ChatState {
  chats: Chat[];
  messages: { [chatId: string]: Message[] };
  currentChat: Chat | null;
  isLoading: boolean;
  error: string | null;
  typingUsers: { [chatId: string]: string[] };
}

const initialState: ChatState = {
  chats: [],
  messages: {},
  currentChat: null,
  isLoading: false,
  error: null,
  typingUsers: {},
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setChats: (state, action: PayloadAction<Chat[]>) => {
      state.chats = action.payload;
    },
    setCurrentChat: (state, action: PayloadAction<Chat>) => {
      state.currentChat = action.payload;
      if (!state.messages[action.payload.id]) {
        state.messages[action.payload.id] = [];
      }
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      const chatId = action.payload.chat_id;
      if (!state.messages[chatId]) {
        state.messages[chatId] = [];
      }
      state.messages[chatId].push(action.payload);
    },
    setMessages: (state, action: PayloadAction<{ chatId: string; messages: Message[] }>) => {
      state.messages[action.payload.chatId] = action.payload.messages;
    },
    setTypingUsers: (state, action: PayloadAction<{ chatId: string; users: string[] }>) => {
      state.typingUsers[action.payload.chatId] = action.payload.users;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { setChats, setCurrentChat, addMessage, setMessages, setTypingUsers, clearError } = chatSlice.actions;
export default chatSlice.reducer;
