import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const ApiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Request interceptor
ApiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
ApiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = await AsyncStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refresh_token: refreshToken,
          });
          await AsyncStorage.setItem('access_token', response.data.access_token);
          originalRequest.headers.Authorization = `Bearer ${response.data.access_token}`;
          return ApiClient(originalRequest);
        } catch (refreshError) {
          await AsyncStorage.removeItem('access_token');
          await AsyncStorage.removeItem('refresh_token');
        }
      }
    }
    return Promise.reject(error);
  }
);

export default ApiClient;
