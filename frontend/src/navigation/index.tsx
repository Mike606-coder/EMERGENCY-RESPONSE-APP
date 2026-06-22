import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// Screens
import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import EmailVerificationScreen from '../screens/Auth/EmailVerificationScreen';
import PhoneVerificationScreen from '../screens/Auth/PhoneVerificationScreen';
import IDVerificationScreen from '../screens/Auth/IDVerificationScreen';

import ChatListScreen from '../screens/Chat/ChatListScreen';
import ChatDetailScreen from '../screens/Chat/ChatDetailScreen';

import EmergencyScreen from '../screens/Emergency/EmergencyScreen';
import EmergencyAlertScreen from '../screens/Emergency/EmergencyAlertScreen';

import MapScreen from '../screens/Map/MapScreen';

import CommunityScreen from '../screens/Community/CommunityScreen';
import PostDetailScreen from '../screens/Community/PostDetailScreen';
import CreatePostScreen from '../screens/Community/CreatePostScreen';

import ProfileScreen from '../screens/Profile/ProfileScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animationEnabled: true,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="EmailVerification" component={EmailVerificationScreen} />
      <Stack.Screen name="PhoneVerification" component={PhoneVerificationScreen} />
      <Stack.Screen name="IDVerification" component={IDVerificationScreen} />
    </Stack.Navigator>
  );
}

function ChatStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ChatList"
        component={ChatListScreen}
        options={{ title: 'Messages' }}
      />
      <Stack.Screen
        name="ChatDetail"
        component={ChatDetailScreen}
        options={{ title: 'Chat' }}
      />
    </Stack.Navigator>
  );
}

function CommunityStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="CommunityFeed"
        component={CommunityScreen}
        options={{ title: 'Community' }}
      />
      <Stack.Screen
        name="PostDetail"
        component={PostDetailScreen}
        options={{ title: 'Post' }}
      />
      <Stack.Screen
        name="CreatePost"
        component={CreatePostScreen}
        options={{ title: 'Create Post' }}
      />
    </Stack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string = '';
          
          if (route.name === 'ChatTab') {
            iconName = focused ? 'chat' : 'chat-outline';
          } else if (route.name === 'MapTab') {
            iconName = focused ? 'map' : 'map';
          } else if (route.name === 'CommunityTab') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'ProfileTab') {
            iconName = focused ? 'person' : 'person-outline';
          }
          
          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#E74C3C',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="ChatTab"
        component={ChatStack}
        options={{ title: 'Messages' }}
      />
      <Tab.Screen
        name="MapTab"
        component={MapScreen}
        options={{ title: 'Map' }}
      />
      <Tab.Screen
        name="CommunityTab"
        component={CommunityStack}
        options={{ title: 'Community' }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
}

function RootStack() {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <>
          <Stack.Screen name="MainTabs" component={MainTabs} />
          <Stack.Screen
            name="Emergency"
            component={EmergencyScreen}
            options={{ animationEnabled: true }}
          />
          <Stack.Screen
            name="EmergencyAlert"
            component={EmergencyAlertScreen}
            options={{ animationEnabled: true }}
          />
        </>
      ) : (
        <Stack.Screen name="Auth" component={AuthStack} />
      )}
    </Stack.Navigator>
  );
}

export default function Navigation() {
  return (
    <NavigationContainer>
      <RootStack />
    </NavigationContainer>
  );
}
