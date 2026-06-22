import React from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { Text, Button, Avatar } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { logout } from '../../store/authSlice';

const ProfileScreen: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <Avatar.Icon size={80} icon="account" />
          <Text style={styles.name}>{user?.full_name || 'User'}</Text>
          <Text style={styles.username}>@{user?.username || 'username'}</Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Email</Text>
          <Text style={styles.infoValue}>{user?.email}</Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Phone</Text>
          <Text style={styles.infoValue}>{user?.phone}</Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Verification Status</Text>
          <Text
            style={[
              styles.infoValue,
              user?.verification_status === 'verified'
                ? styles.verified
                : styles.pending,
            ]}
          >
            {user?.verification_status || 'Pending'}
          </Text>
        </View>

        <Button
          mode="contained"
          onPress={handleLogout}
          style={styles.logoutButton}
        >
          Logout
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
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 10,
  },
  username: {
    fontSize: 14,
    color: '#666',
  },
  infoBox: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  infoLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
  },
  verified: {
    color: '#4CAF50',
  },
  pending: {
    color: '#FFA500',
  },
  logoutButton: {
    marginTop: 20,
  },
});

export default ProfileScreen;
