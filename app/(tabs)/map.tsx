import React, { useState, useEffect, useRef } from "react";
import { View, Pressable, ScrollView } from "react-native";
import MapView, { Marker, Circle } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, RefreshCw, Navigation, Clock } from "lucide-react-native";
import { useAuth } from "@/lib/auth-context";
import { formatToPhilippineTime } from "@/lib/time-utils";

// Firebase imports
import { db } from "@/firebase";
import { collection, doc, setDoc, onSnapshot, query, orderBy, limit } from "firebase/firestore";

interface Location {
  latitude: number;
  longitude: number;
}

export default function MapScreen() {
  const { userProfile } = useAuth();
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
          showsCompass
          showsScale
          showsUserLocation={false}
          showsMyLocationButton={false}
          mapType="standard"
        >
          <Circle
            center={location}
            radius={40}
            fillColor="rgba(0,122,255,0.12)"
            strokeColor="rgba(0,122,255,0.25)"
            strokeWidth={1}
          />
          <Marker coordinate={location} title="Student Location" description={getTimeAgo(lastUpdated)}>
            <View
              style={{
                width: 28,
                height: 28,
                borderRadius: 14,
                backgroundColor: "rgba(0,122,255,0.25)",
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 1.5,
                borderColor: "#007AFF",
              }}
            >
              <View
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: "#007AFF",
                }}
              />
            </View>
          </Marker>
        </MapView>
      )}

      {/* No location yet or error */}
      {(!location || error) && (
        <View className="flex-1 items-center justify-center bg-muted/20">
          <View className="w-16 h-16 rounded-full bg-primary/10 items-center justify-center mb-4">
            <MapPin className="text-primary" size={32} />
          </View>
          <Text className="text-foreground text-lg font-semibold mb-2">
            {error ? "Error Loading Location" : "Loading Location..."}
          </Text>
          <Text className="text-muted-foreground text-center px-8">
            {error || "Please wait while we fetch the student's current location"}
          </Text>
          {error && (
            <Pressable
              onPress={() => {
                setError(null);
                sendLocationCommand();
              }}
              className="bg-primary px-6 py-3 rounded-lg mt-4"
            >
              <Text className="text-primary-foreground font-medium">Try Again</Text>
            </Pressable>
          )}
        </View>
      )}

      {/* Info Panel */}
      <View className="absolute bottom-6 left-4 right-4">
        <Card className="shadow-xl border-0 bg-card/95 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Navigation className="text-primary mr-2" size={20} />
                <CardTitle className="text-lg text-foreground">Current Location</CardTitle>
              </View>
              <View className="flex-row items-center">
                <Clock className="text-muted-foreground mr-2" size={16} />
                <Text className="text-muted-foreground text-sm">{lastUpdated || "No data"}</Text>
              </View>
            </View>
          </CardHeader>

          <CardContent className="pt-0">
            {location ? (
              <>
                <View className="flex-row" style={{ gap: 24 }}>
                  <View className="flex-1">
                    <Text className="text-muted-foreground text-xs font-medium mb-2">LATITUDE</Text>
                    <View className="bg-secondary rounded-lg px-3 py-2 border border-border">
                      <Text className="text-secondary-foreground font-mono text-sm">
                        {formatCoordinate(location.latitude)}
                      </Text>
                    </View>
                  </View>

                  <View className="flex-1">
                    <Text className="text-muted-foreground text-xs font-medium mb-2">LONGITUDE</Text>
                    <View className="bg-secondary rounded-lg px-3 py-2 border border-border">
                      <Text className="text-secondary-foreground font-mono text-sm">
                        {formatCoordinate(location.longitude)}
                      </Text>
                    </View>
                  </View>
                </View>

                <View className="flex-row items-center justify-between mt-4">
                  <Badge className="bg-green-500 border-green-500">
                    <Text className="text-xs text-white">Active</Text>
                  </Badge>
                  <Text className="text-muted-foreground text-sm">{getTimeAgo(lastUpdated)}</Text>
                </View>
              </>
            ) : (
              <View className="items-center py-6">
                <Text className="text-muted-foreground text-center">Location data unavailable</Text>
              </View>
            )}
          </CardContent>
        </Card>

        {/* Command Button */}
        <View className="mt-6">
          <Button
            onPress={sendLocationCommand}
            className="w-full h-12 rounded-md"
            size="default"
            disabled={isRequesting}
          >
            <Text className="text-primary-foreground font-semibold">
              {isRequesting ? "Requesting..." : "GET GPS LOCATION"}
            </Text>
          </Button>
        </View>
      </View>

      {/* Quick Actions */}
      <View className="absolute top-8 right-4">
        <Pressable
          onPress={sendLocationCommand}
          className="w-12 h-12 rounded-full bg-card shadow-lg border border-border items-center justify-center mb-4"
        >
          <RefreshCw className="text-foreground" size={20} />
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
          className="w-12 h-12 rounded-full bg-card shadow-lg border border-border items-center justify-center"
        >
          <Navigation className="text-foreground" size={20} />
        </Pressable>
      </View>

    </SafeAreaView>
  );
}
