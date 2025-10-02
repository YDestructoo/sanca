import React, { useState, useEffect, useRef } from "react";
import { View, Pressable, ScrollView, useColorScheme } from "react-native";
import MapView, { Marker, Circle } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemedIcon } from "@/components/ui/ThemeIcon";
import { useAuth } from "@/lib/auth-context";
import { formatToPhilippineTime } from "@/lib/time-utils";

// Firebase imports
import { db } from "@/firebase";
import { collection, doc, setDoc, onSnapshot, query, orderBy, limit } from "firebase/firestore";

// Dark mode map style
const darkMapStyle = [
  { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#263c3f" }],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: "#6b9a76" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#38414e" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#212a37" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9ca5b3" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#746855" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#1f2835" }],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [{ color: "#f3d19c" }],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#2f3948" }],
  },
  {
    featureType: "transit.station",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#17263c" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#515c6d" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#17263c" }],
  },
];

interface Location {
  latitude: number;
  longitude: number;
}

export default function MapScreen() {
  const { userProfile } = useAuth();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const token = userProfile?.adminToken || userProfile?.uid || "";
  const [location, setLocation] = useState<Location | null>(null);
  const [lastUpdated, setLastUpdated] = useState("");
  const [isRequesting, setIsRequesting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mapRef = useRef<MapView>(null);

  // Send command to ESP32
  const sendLocationCommand = async () => {
    try {
      if (!token) {
        setError("No user token available");
        return;
      }
      
      setIsRequesting(true);
      setError(null);
      await setDoc(doc(db, "data", token, "commands", "latest"), {
        command: "getLocation",
        timestamp: new Date().toISOString(),
      });
      console.log("📡 Command sent to ESP32");
    } catch (error) {
      console.error("Error sending command:", error);
      setError("Failed to send location request");
    } finally {
      setIsRequesting(false);
    }
  };

  // Listen for latest location log
  useEffect(() => {
    if (!token) {
      setError("No user token available");
      return;
    }

    setError(null);
    const logsRef = collection(db, "data", token, "logs");
    const q = query(logsRef, orderBy("timestamp", "desc"), limit(1));

    const unsub = onSnapshot(q, (snapshot) => {
      try {
        if (!snapshot.empty) {
          const latestDoc = snapshot.docs[0];
          const data = latestDoc.data();
          console.log("📡 Firestore Data:", data);

          const lat = parseFloat(data.latitude);
          const lng = parseFloat(data.longitude ?? data.longtitude); // fallback typo support

          if (!isNaN(lat) && !isNaN(lng)) {
            setLocation({ latitude: lat, longitude: lng });
            setLastUpdated(data.timestamp ? formatToPhilippineTime(data.timestamp) : formatToPhilippineTime(new Date()));
            setError(null);
          } else {
            console.warn("⚠️ Invalid coordinates:", data);
            setError("Invalid location data received");
          }
          setIsRequesting(false);
        } else {
          console.log("No logs found for token:", token);
          setError("No location data available");
        }
      } catch (err) {
        console.error("Error processing location data:", err);
        setError("Failed to load location data");
        setIsRequesting(false);
      }
    }, (err) => {
      console.error("Firestore error:", err);
      setError("Failed to connect to database");
      setIsRequesting(false);
    });

    return () => unsub();
  }, [token]);

  const formatCoordinate = (coord?: number) =>
    coord !== undefined ? coord.toFixed(6) : "N/A";

  const getTimeAgo = (timeString: string) =>
    timeString ? `Updated at ${timeString}` : "Never";

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Map */}
      {location && (
        <MapView
          ref={mapRef}
          style={{ position: "absolute", top: 0, bottom: 0, left: 0, right: 0 }}
          region={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
          customMapStyle={isDark ? darkMapStyle : []}
          showsCompass
          showsScale
          showsUserLocation={false}
          showsMyLocationButton={false}
          mapType="standard"
        >
          <Circle
            center={location}
            radius={40}
            fillColor={isDark ? "rgba(59,130,246,0.15)" : "rgba(0,122,255,0.12)"}
            strokeColor={isDark ? "rgba(59,130,246,0.3)" : "rgba(0,122,255,0.25)"}
            strokeWidth={1.5}
          />
          <Marker coordinate={location} title="Student Location" description={getTimeAgo(lastUpdated)}>
            <View
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: isDark ? "rgba(59,130,246,0.3)" : "rgba(0,122,255,0.25)",
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 2,
                borderColor: isDark ? "#3b82f6" : "#007AFF",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
              }}
            >
              <View
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 6,
                  backgroundColor: isDark ? "#3b82f6" : "#007AFF",
                }}
              />
            </View>
          </Marker>
        </MapView>
      )}

      {/* No location yet or error */}
      {(!location || error) && (
        <View className="flex-1 items-center justify-center bg-muted/30">
          <View className="w-20 h-20 rounded-full bg-primary/10 items-center justify-center mb-4">
            <ThemedIcon name="MapPin" size={36} colorKey="primary" />
          </View>
          <Text className="text-foreground text-xl font-semibold mb-2">
            {error ? "Error Loading Location" : "Loading Location..."}
          </Text>
          <Text className="text-muted-foreground text-center px-8 mb-4">
            {error || "Please wait while we fetch the student's current location"}
          </Text>
          {error && (
            <Pressable
              onPress={() => {
                setError(null);
                sendLocationCommand();
              }}
              className="bg-primary px-8 py-3 rounded-lg active:opacity-80"
            >
              <Text className="text-primary-foreground font-semibold">Try Again</Text>
            </Pressable>
          )}
        </View>
      )}

      {/* Info Panel */}
      <View className="absolute bottom-6 left-4 right-4">
        <Card className="shadow-2xl border border-border/50">
          <CardHeader className="pb-3">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <ThemedIcon name="Navigation" size={20} colorKey="primary" />
                <Text className="text-lg font-semibold text-foreground ml-2">Current Location</Text>
              </View>
              <View className="flex-row items-center">
                <ThemedIcon name="Clock" size={16} colorKey="mutedForeground" />
                <Text className="text-muted-foreground text-xs ml-2">{lastUpdated || "No data"}</Text>
              </View>
            </View>
          </CardHeader>

          <CardContent className="pt-0">
            {location ? (
              <>
                <View className="flex-row" style={{ gap: 12 }}>
                  <View className="flex-1">
                    <Text className="text-muted-foreground text-xs font-semibold mb-2 tracking-wider">LATITUDE</Text>
                    <View className="bg-muted/50 rounded-lg px-3 py-3 border border-border/50">
                      <Text className="text-foreground font-mono text-sm font-medium">
                        {formatCoordinate(location.latitude)}
                      </Text>
                    </View>
                  </View>

                  <View className="flex-1">
                    <Text className="text-muted-foreground text-xs font-semibold mb-2 tracking-wider">LONGITUDE</Text>
                    <View className="bg-muted/50 rounded-lg px-3 py-3 border border-border/50">
                      <Text className="text-foreground font-mono text-sm font-medium">
                        {formatCoordinate(location.longitude)}
                      </Text>
                    </View>
                  </View>
                </View>

                <View className="flex-row items-center justify-between mt-4 pt-3 border-t border-border/50">
                  <View className="flex-row items-center">
                    <View className="w-2 h-2 rounded-full bg-green-500 mr-2" />
                    <Text className="text-green-600 dark:text-green-400 text-xs font-semibold">ACTIVE</Text>
                  </View>
                  <Text className="text-muted-foreground text-xs">{getTimeAgo(lastUpdated)}</Text>
                </View>
              </>
            ) : (
              <View className="items-center py-8">
                <ThemedIcon name="MapPin" size={32} colorKey="mutedForeground" />
                <Text className="text-muted-foreground text-center mt-3">Location data unavailable</Text>
              </View>
            )}
          </CardContent>
        </Card>

        {/* Command Button */}
        <View className="mt-4">
          <Button
            onPress={sendLocationCommand}
            className="w-full h-13 rounded-xl shadow-lg"
            size="default"
            disabled={isRequesting}
          >
            <View className="flex-row items-center">
              <ThemedIcon name="RefreshCw" size={18} colorKey="primaryForeground" />
              <Text className="text-primary-foreground font-bold text-base ml-2">
                {isRequesting ? "REQUESTING..." : "GET GPS LOCATION"}
              </Text>
            </View>
          </Button>
        </View>
      </View>

      {/* Quick Actions */}
      <View className="absolute top-8 right-4">
        <Pressable
          onPress={sendLocationCommand}
          className="w-12 h-12 rounded-full shadow-lg border border-border bg-card items-center justify-center mb-4 active:opacity-70"
        >
          <ThemedIcon name="RefreshCw" size={20} colorKey="foreground" />
        </Pressable>

        <Pressable 
          onPress={() => {
            // Center map on current location if available
            if (location && mapRef.current) {
              mapRef.current.animateToRegion({
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }, 1000);
            } else {
              console.log("No location available to center on");
            }
          }}
          className="w-12 h-12 rounded-full shadow-lg border border-border bg-card items-center justify-center active:opacity-70"
        >
          <ThemedIcon name="Navigation" size={20} colorKey="foreground" />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}