import React, { useState, useEffect } from 'react';
import { View, Alert } from 'react-native';
import * as Location from 'expo-location';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, CheckCircle } from 'lucide-react-native';
import { useAuth } from '@/lib/auth-context';
import { db } from '@/firebaseConfig';
import { doc, setDoc, collection, addDoc } from 'firebase/firestore';
import { formatToPhilippineTime, createPhilippineTimestamp } from '@/lib/time-utils';

interface ManualLoggerProps {
  onLogComplete?: () => void;
}

export default function ManualLogger({ onLogComplete }: ManualLoggerProps) {
  const { userProfile } = useAuth();
  const token = userProfile?.adminToken || userProfile?.uid || "";
  
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      setIsGettingLocation(true);
      
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Location permission is required for manual logging.');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      
      setLocation(currentLocation);
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Location Error', 'Failed to get current location. Please try again.');
    } finally {
      setIsGettingLocation(false);
    }
  };

  const handleLogLocation = async () => {
    try {
      setIsUploading(true);
      
      // Log the manual entry to Firestore
      const logData = {
        timestamp: createPhilippineTimestamp(),
        latitude: location?.coords.latitude || 0,
        longitude: location?.coords.longitude || 0,
        accuracy: location?.coords.accuracy || 0,
        time: formatToPhilippineTime(new Date()),
        type: 'manual',
        address: '', // Will be filled by reverse geocoding if needed
        createdBy: 'manual_logger',
      };

      // Add to logs collection
      await addDoc(collection(db, 'data', token, 'logs'), logData);
      
      // Also send command to ESP32 to sync
      await setDoc(doc(db, 'data', token, 'commands', 'latest'), {
        command: 'syncManualLog',
        timestamp: createPhilippineTimestamp(),
        data: logData,
      });

      setIsLogged(true);
      
      if (onLogComplete) {
        onLogComplete();
      }
      
      Alert.alert('Success', 'Location logged successfully!');
    } catch (error) {
      console.error('Error logging manual entry:', error);
      Alert.alert('Logging Error', 'Failed to log manual entry. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const resetLogger = () => {
    setIsLogged(false);
    getCurrentLocation();
  };

  const formatCoordinate = (coord: number) => coord.toFixed(6);

  return (
    <Card className="m-4">
      <CardHeader>
        <CardTitle className="flex-row items-center">
          <MapPin className="text-primary mr-2" size={20} />
          <Text className="text-lg">Manual Location & Voice Log</Text>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Location Status */}
        <View className="space-y-2">
          <Text className="font-medium">Current Location:</Text>
          {isGettingLocation ? (
            <Text className="text-muted-foreground">Getting location...</Text>
          ) : location ? (
            <View className="space-y-1">
              <View className="flex-row items-center">
                <Badge variant="default" className="mr-2">
                  <Text className="text-xs">GPS</Text>
                </Badge>
                <Text className="text-sm text-muted-foreground">
                  Accuracy: {Math.round(location.coords.accuracy || 0)}m
                </Text>
              </View>
              <Text className="text-sm font-mono">
                Lat: {formatCoordinate(location.coords.latitude)}
              </Text>
              <Text className="text-sm font-mono">
                Lng: {formatCoordinate(location.coords.longitude)}
              </Text>
            </View>
          ) : (
            <Text className="text-muted-foreground">Location not available</Text>
          )}
        </View>

        {/* Refresh Location Button */}
        <Button
          onPress={getCurrentLocation}
          variant="outline"
          disabled={isGettingLocation}
          className="w-full"
        >
          <Text className="text-foreground">
            {isGettingLocation ? 'Getting Location...' : 'Refresh Location'}
          </Text>
        </Button>

        {/* Log Location Button */}
        <Button
          onPress={handleLogLocation}
          disabled={!location || isUploading}
          className="w-full"
        >
          <Text className="text-primary-foreground">
            {isUploading ? 'Logging...' : 'Log Current Location'}
          </Text>
        </Button>

        {/* Status */}
        {isLogged && (
          <View className="flex-row items-center justify-center p-3 bg-green-50 rounded-lg">
            <CheckCircle className="text-green-600 mr-2" size={20} />
            <Text className="text-green-600 font-medium">
              Log recorded successfully!
            </Text>
          </View>
        )}

        {/* Reset Button */}
        {isLogged && (
          <Button
            onPress={resetLogger}
            variant="outline"
            className="w-full"
          >
            <Text className="text-foreground">Log Another Entry</Text>
          </Button>
        )}

        {/* Instructions */}
        <Text className="text-sm text-muted-foreground text-center">
          {!location 
            ? 'Location permission required for manual logging'
            : 'Tap "Log Current Location" to record your location'
          }
        </Text>
      </CardContent>
    </Card>
  );
}
