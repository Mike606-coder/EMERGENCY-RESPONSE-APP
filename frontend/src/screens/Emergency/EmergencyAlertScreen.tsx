import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { Button, Text, ActivityIndicator } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { createEmergencyStart, createEmergencySuccess, createEmergencyError } from '../../store/emergencySlice';
import { setCurrentLocation } from '../../store/locationSlice';
import LocationService from '../../services/location';
import ApiClient from '../../services/api';

const EmergencyAlertScreen: React.FC<any> = ({ navigation }) => {
  const [emergencyType, setEmergencyType] = useState<string>('medical');
  const dispatch = useDispatch<AppDispatch>();
  const location = useSelector((state: RootState) => state.location.currentLocation);
  const isCreating = useSelector((state: RootState) => state.emergency.isCreating);

  useEffect(() => {
    // Get current location when screen loads
    const getCurrentLocation = async () => {
      try {
        const loc = await LocationService.getCurrentLocation();
        dispatch(setCurrentLocation({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          altitude: loc.coords.altitude,
          accuracy: loc.coords.accuracy,
          timestamp: new Date().toISOString(),
        }));
      } catch (error) {
        Alert.alert('Error', 'Could not get location. Please enable location services.');
      }
    };

    getCurrentLocation();
  }, [dispatch]);

  const handleEmergencyAlert = async () => {
    if (!location) {
      Alert.alert('Error', 'Location not available');
      return;
    }

    dispatch(createEmergencyStart());
    try {
      const response = await ApiClient.post('/emergency/alert', {
        emergency_type: emergencyType,
        latitude: location.latitude,
        longitude: location.longitude,
        description: 'Emergency alert triggered from mobile app',
      });

      dispatch(createEmergencySuccess(response.data));
      Alert.alert('Success', 'Emergency alert sent to nearby responders');
      setTimeout(() => navigation.goBack(), 2000);
    } catch (error: any) {
      dispatch(createEmergencyError(error.message || 'Failed to send alert'));
      Alert.alert('Error', 'Failed to send emergency alert');
    }
  };

  const emergencyTypes = [
    { label: '🚑 Medical', value: 'medical' },
    { label: '🚔 Crime', value: 'crime' },
    { label: '🚒 Fire', value: 'fire' },
    { label: '🚗 Accident', value: 'accident' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Emergency Alert</Text>
        <Text style={styles.subtitle}>Select emergency type and we'll alert nearby responders</Text>

        {location ? (
          <View style={styles.locationBox}>
            <Text style={styles.locationText}>📍 Location captured</Text>
            <Text style={styles.coordinates}>
              {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
            </Text>
          </View>
        ) : (
          <ActivityIndicator size="large" style={styles.loader} />
        )}

        <View style={styles.typeButtons}>
          {emergencyTypes.map((type) => (
            <Button
              key={type.value}
              mode={emergencyType === type.value ? 'contained' : 'outlined'}
              onPress={() => setEmergencyType(type.value)}
              style={styles.typeButton}
            >
              {type.label}
            </Button>
          ))}
        </View>

        <Button
          mode="contained"
          onPress={handleEmergencyAlert}
          style={styles.alertButton}
          disabled={isCreating || !location}
          loading={isCreating}
        >
          Send Emergency Alert
        </Button>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#E74C3C',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 20,
  },
  locationBox: {
    backgroundColor: '#E8F5E9',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  locationText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  coordinates: {
    fontSize: 12,
    color: '#555',
    marginTop: 4,
  },
  loader: {
    marginBottom: 20,
  },
  typeButtons: {
    marginBottom: 20,
  },
  typeButton: {
    marginVertical: 8,
  },
  alertButton: {
    paddingVertical: 10,
    backgroundColor: '#E74C3C',
  },
});

export default EmergencyAlertScreen;
