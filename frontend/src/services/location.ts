import * as Location from 'expo-location';
import { LocationObject } from 'expo-location';

class LocationService {
  static async requestLocationPermission(): Promise<boolean> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Location permission error:', error);
      return false;
    }
  }

  static async getCurrentLocation(): Promise<LocationObject> {
    try {
      const hasPermission = await this.requestLocationPermission();
      if (!hasPermission) {
        throw new Error('Location permission not granted');
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });
      return location;
    } catch (error) {
      console.error('Get location error:', error);
      throw error;
    }
  }

  static async startLocationTracking(
    callback: (location: LocationObject) => void,
    updateInterval: number = 10000
  ): Promise<void> {
    try {
      const hasPermission = await this.requestLocationPermission();
      if (!hasPermission) {
        throw new Error('Location permission not granted');
      }

      await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Highest,
          timeInterval: updateInterval,
          distanceInterval: 10, // meters
        },
        callback
      );
    } catch (error) {
      console.error('Location tracking error:', error);
      throw error;
    }
  }

  static async getAddressFromCoords(
    latitude: number,
    longitude: number
  ): Promise<string> {
    try {
      const results = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (results.length > 0) {
        const address = results[0];
        return `${address.city}, ${address.region}`;
      }
      return 'Unknown location';
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return 'Unknown location';
    }
  }
}

export default LocationService;
