import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { Text, Button } from 'react-native-paper';

const RegisterScreen: React.FC<any> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join our emergency response community</Text>
        <Button mode="contained" onPress={() => {}} style={styles.button}>
          Next Step
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
  content: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    color: '#E74C3C',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 40,
  },
  button: {
    marginTop: 20,
    backgroundColor: '#E74C3C',
    paddingVertical: 8,
  },
});

export default RegisterScreen;
