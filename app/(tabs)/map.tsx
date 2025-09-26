import React, { useEffect, useState } from "react";
import { View, Text, Button } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

export default function MapScreen() {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [lastUpdated, setLastUpdated] = useState("");
  const [error, setError] = useState("");

  // Fetch location + placeholder for voice recording
  const handleUpdateAndRecord = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setError("Location permission denied");
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });

      setLastUpdated(new Date().toLocaleTimeString());
      console.log("Voice recording started (placeholder)");
    } catch (err) {
      setError("Failed to get location");
    }
  };

  // Auto-update every 30 mins
  useEffect(() => {
    handleUpdateAndRecord();
    const interval = setInterval(() => handleUpdateAndRecord(), 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {location && (
        <MapView
          style={{ flex: 1 }}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title="Current Location"
          />
        </MapView>
      )}

      <View style={{ padding: 10 }}>
        {error ? (
          <Text style={{ color: "red" }}>{error}</Text>
        ) : (
          <>
            <Text>GPS Location</Text>
            <Text>Latitude: {location?.latitude ?? "..."}</Text>
            <Text>Longitude: {location?.longitude ?? "..."}</Text>
            <Text>Last update: {lastUpdated || "..."}</Text>
            <Button title="Update Location & Record" onPress={handleUpdateAndRecord} />
          </>
        )}
      </View>
    </View>
  );
}
