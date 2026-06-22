import React from 'react';
import { View, StyleSheet, SafeAreaView, FlatList } from 'react-native';
import { Text, Card, Button } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const CommunityScreen: React.FC<any> = ({ navigation }) => {
  const posts = useSelector((state: RootState) => state.chat.chats); // Placeholder

  const renderPost = ({ item }: any) => (
    <Card
      style={styles.card}
      onPress={() => navigation.navigate('PostDetail', { postId: item.id })}
    >
      <Card.Content>
        <Text style={styles.postTitle}>{item.name || 'Post'}</Text>
        <Text numberOfLines={2}>{item.last_message?.content || 'No content'}</Text>
      </Card.Content>
      <Card.Actions>
        <Button>Like</Button>
        <Button>Comment</Button>
      </Card.Actions>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No posts yet</Text>
            <Button
              mode="contained"
              onPress={() => navigation.navigate('CreatePost')}
            >
              Create Post
            </Button>
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
  postTitle: {
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

export default CommunityScreen;
