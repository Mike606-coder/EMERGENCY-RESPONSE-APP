import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import { loginStart, loginSuccess, loginError } from '../../store/authSlice';
import ApiClient from '../../services/api';

const LoginScreen: React.FC<any> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const handleLogin = async () => {
    if (!email || !password) {
      dispatch(loginError('Please fill in all fields'));
      return;
    }

    dispatch(loginStart());
    try {
      const response = await ApiClient.post('/auth/login', {
        email_or_phone: email,
        password,
      });

      dispatch(
        loginSuccess({
          user: response.data.user,
          token: response.data.access_token,
          refreshToken: response.data.refresh_token,
        })
      );
    } catch (err: any) {
      dispatch(loginError(err.message || 'Login failed'));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Emergency Response App</Text>
        <Text style={styles.subtitle}>Stay Safe, Connect Fast</Text>

        <TextInput
          label="Email or Phone"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
          mode="outlined"
        />

        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          secureTextEntry={!showPassword}
          mode="outlined"
          right={
            <TextInput.Icon
              icon={showPassword ? 'eye-off' : 'eye'}
              onPress={() => setShowPassword(!showPassword)}
            />
          }
        />

        <Button mode="contained" onPress={handleLogin} style={styles.button}>
          Login
        </Button>

        <View style={styles.footer}>
          <Text>Don't have an account? </Text>
          <Button
            mode="text"
            onPress={() => navigation.navigate('Register')}
            compact
          >
            Register
          </Button>
        </View>
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
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 20,
    backgroundColor: '#E74C3C',
    paddingVertical: 8,
  },
  footer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoginScreen;
