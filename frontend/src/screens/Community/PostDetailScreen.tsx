import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { Text } from 'react-native-paper';

const PostDetailScreen: React.FC<any> = ({ route }) => {
  const { postId } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Post Detail</Text>
        <Text>{postId}</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default PostDetailScreen;
