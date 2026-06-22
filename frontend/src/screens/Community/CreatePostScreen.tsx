import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import ApiClient from '../../services/api';

const CreatePostScreen: React.FC<any> = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [postType, setPostType] = useState('help_request');
  const [isLoading, setIsLoading] = useState(false);

  const handleCreatePost = async () => {
    if (!title || !content) {
      alert('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      await ApiClient.post('/community/posts', {
        title,
        content,
        post_type: postType,
      });
      alert('Post created successfully');
      navigation.goBack();
    } catch (error) {
      alert('Failed to create post');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <Text style={styles.title}>Create Post</Text>

        <TextInput
          label="Title"
          value={title}
          onChangeText={setTitle}
          style={styles.input}
          mode="outlined"
        />

        <TextInput
          label="Description"
          value={content}
          onChangeText={setContent}
          style={[styles.input, styles.textArea]}
          mode="outlined"
          multiline
          numberOfLines={4}
        />

        <Button
          mode="contained"
          onPress={handleCreatePost}
          loading={isLoading}
          style={styles.button}
        >
          Post
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    marginBottom: 16,
  },
  textArea: {
    height: 120,
  },
  button: {
    marginTop: 20,
    paddingVertical: 8,
  },
});

export default CreatePostScreen;
