import React from 'react';
import { View, StyleSheet, SafeAreaView, FlatList } from 'react-native';
import { Text, Card, Button } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const ChatListScreen: React.FC<any> = ({ navigation }) => {
  const chats = useSelector((state: RootState) => state.chat.chats);

  const renderChat = ({ item }: any) => (
    <Card style={styles.card} onPress={() => navigation.navigate('ChatDetail', { chatId: item.id })}>
      <Card.Content>
        <Text style={styles.chatName}>{item.name || 'Chat'}</Text>
        <Text numberOfLines={1}>{item.last_message?.content || 'No messages'}</Text>
      </Card.Content>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={chats}
        renderItem={renderChat}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No chats yet</Text>
            <Button mode="contained" onPress={() => {}}>Start a Chat</Button>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  card: {
    margin: 8,
  },
  chatName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default ChatListScreen;
