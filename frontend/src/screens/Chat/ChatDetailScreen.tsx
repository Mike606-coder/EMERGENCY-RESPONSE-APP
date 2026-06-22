import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, FlatList } from 'react-native';
import { TextInput, Button, Text, Card } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { addMessage } from '../../store/chatSlice';

const ChatDetailScreen: React.FC<any> = ({ route }) => {
  const [message, setMessage] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const { chatId } = route.params;
  const messages = useSelector(
    (state: RootState) => state.chat.messages[chatId] || []
  );

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      chat_id: chatId,
      sender_id: 'current-user',
      content: message,
      message_type: 'text',
      created_at: new Date().toISOString(),
    };

    dispatch(addMessage(newMessage));
    setMessage('');
  };

  const renderMessage = ({ item }: any) => (
    <Card style={styles.messageCard}>
      <Card.Content>
        <Text>{item.content}</Text>
        <Text style={styles.timestamp}>{new Date(item.created_at).toLocaleTimeString()}</Text>
      </Card.Content>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        style={styles.messagesList}
      />
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Type a message..."
          value={message}
          onChangeText={setMessage}
          style={styles.input}
          mode="outlined"
        />
        <Button
          mode="contained"
          onPress={handleSendMessage}
          style={styles.sendButton}
        >
          Send
        </Button>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  messagesList: {
    flex: 1,
    padding: 10,
  },
  messageCard: {
    marginBottom: 10,
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  input: {
    flex: 1,
    marginRight: 10,
  },
  sendButton: {
    justifyContent: 'center',
  },
});

export default ChatDetailScreen;
