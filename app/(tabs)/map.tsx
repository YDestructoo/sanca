import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, useColorScheme } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { THEME } from "@/lib/theme";
import { Mic } from "lucide-react-native";

export default function MapScreen() {
  const colorScheme = useColorScheme() as "light" | "dark"; // ✅ TypeScript fix
  const theme = THEME[colorScheme ?? "light"]; // ✅ Now TypeScript knows the type

  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [lastUpdated, setLastUpdated] = useState("");

  // Mock location for now
  const fetchMockLocation = () => {
    setLocation({
      latitude: 40.123 + Math.random() * 0.01,
      longitude: -111.123 + Math.random() * 0.01,
    });
    setLastUpdated(new Date().toLocaleTimeString());
  };

  useEffect(() => {
    fetchMockLocation();
    const interval = setInterval(() => fetchMockLocation(), 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
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
            coordinate={{ latitude: location.latitude, longitude: location.longitude }}
            title="Student Location"
            description={`Last update: ${lastUpdated}`}
          />
        </MapView>
      )}

      <View style={{ position: "absolute", bottom: 20, left: 20, right: 20 }}>
        <View
          style={{
            backgroundColor: theme.card,
            borderRadius: 10,
            padding: 12,
            marginBottom: 10,
          }}
        >
          <Text style={{ color: theme.foreground, fontWeight: "bold" }}>Student Location</Text>
          <Text style={{ color: theme.mutedForeground }}>Latitude: {location?.latitude ?? "..."}</Text>
          <Text style={{ color: theme.mutedForeground }}>Longitude: {location?.longitude ?? "..."}</Text>
          <Text style={{ color: theme.mutedForeground }}>Last update: {lastUpdated || "..."}</Text>
        </View>

        <TouchableOpacity
          onPress={fetchMockLocation}
          style={{
            backgroundColor: theme.primary,
            padding: 14,
            borderRadius: 50,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Mic size={22} color={theme.primaryForeground} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
