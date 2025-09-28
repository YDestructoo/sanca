import React, { useState, useEffect } from "react";
import { View, Pressable } from "react-native";
import MapView, { Marker, Circle } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, RefreshCw, Navigation, Clock } from "lucide-react-native";

// Firebase imports
import { db } from "@/firebaseConfig";
import { collection, doc, setDoc, onSnapshot, query, orderBy, limit } from "firebase/firestore";

interface Location {
  latitude: number;
  longitude: number;
}

export default function MapScreen() {
  const token = "abc123XYZ"; // TODO: Replace with user token after login
  const [location, setLocation] = useState<Location | null>(null);
  const [lastUpdated, setLastUpdated] = useState("");
  const [isRequesting, setIsRequesting] = useState(false);

  // Send command to ESP32
  const sendLocationCommand = async () => {
    try {
      setIsRequesting(true);
      await setDoc(doc(db, "data", token, "commands", "latest"), {
        command: "getLocation",
        timestamp: new Date().toISOString(),
      });
      console.log("📡 Command sent to ESP32");
    } catch (error) {
      console.error("Error sending command:", error);
    }
  };

  // Listen for latest location log
  useEffect(() => {
    if (!token) return;

    const logsRef = collection(db, "data", token, "logs");
    const q = query(logsRef, orderBy("timestamp", "desc"), limit(1));

    const unsub = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const latestDoc = snapshot.docs[0];
        const data = latestDoc.data();
        console.log("📡 Firestore Data:", data);

        const lat = parseFloat(data.latitude);
        const lng = parseFloat(data.longitude ?? data.longtitude); // fallback typo support

        if (!isNaN(lat) && !isNaN(lng)) {
          setLocation({ latitude: lat, longitude: lng });
          setLastUpdated(data.timestamp || new Date().toLocaleTimeString());
        } else {
          console.warn("⚠️ Invalid coordinates:", data);
        }
        setIsRequesting(false);
      } else {
        console.log("No logs found for token:", token);
      }
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
          style={{ position: "absolute", top: 0, bottom: 0, left: 0, right: 0 }}
          region={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
          showsCompass
          showsScale
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

      {/* No location yet */}
      {!location && (
        <View className="flex-1 items-center justify-center bg-muted/20">
          <View className="w-16 h-16 rounded-full bg-primary/10 items-center justify-center mb-4">
            <MapPin className="text-primary" size={32} />
          </View>
          <Text className="text-foreground text-lg font-semibold mb-2">
            Loading Location...
          </Text>
          <Text className="text-muted-foreground text-center px-8">
            Please wait while we fetch the student's current location
          </Text>
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

          <CardContent className="pt-0 space-y-3">
            {location ? (
              <>
                <View className="flex-row space-x-6">
                  <View className="flex-1">
                    <Text className="text-muted-foreground text-xs font-medium mb-1">LATITUDE</Text>
                    <View className="bg-secondary rounded-lg px-3 py-2 border border-border">
                      <Text className="text-secondary-foreground font-mono text-sm">
                        {formatCoordinate(location.latitude)}
                      </Text>
                    </View>
                  </View>

                  <View className="flex-1">
                    <Text className="text-muted-foreground text-xs font-medium mb-1">LONGITUDE</Text>
                    <View className="bg-secondary rounded-lg px-3 py-2 border border-border">
                      <Text className="text-secondary-foreground font-mono text-sm">
                        {formatCoordinate(location.longitude)}
                      </Text>
                    </View>
                  </View>
                </View>

                <View className="flex-row items-center justify-between pt-2">
                  <Badge variant="default" className="mr-2">
                    <Text className="text-xs">Active</Text>
                  </Badge>
                  <Text className="text-muted-foreground text-sm">{getTimeAgo(lastUpdated)}</Text>
                </View>
              </>
            ) : (
              <View className="items-center py-4">
                <Text className="text-muted-foreground text-center">Location data unavailable</Text>
              </View>
            )}
          </CardContent>
        </Card>

        {/* Command Button */}
        <View className="mt-4">
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
      <View className="absolute top-8 right-4 space-y-3">
        <Pressable
          onPress={sendLocationCommand}
          className="w-12 h-12 rounded-full bg-card shadow-lg border border-border items-center justify-center"
        >
          <RefreshCw className="text-foreground" size={20} />
        </Pressable>

        <Pressable className="w-12 h-12 rounded-full bg-card shadow-lg border border-border items-center justify-center">
          <Navigation className="text-foreground" size={20} />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
