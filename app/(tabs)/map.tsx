import React, { useState, useEffect } from "react";
import { View, Pressable } from "react-native";
import MapView, { Marker, Circle } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";

// React Native Reusables imports
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Icons
import { MapPin, RefreshCw, Navigation, Clock } from "lucide-react-native";

interface Location {
  latitude: number;
  longitude: number;
}

export default function MapScreen() {
  const [location, setLocation] = useState<Location | null>(null);
  const [lastUpdated, setLastUpdated] = useState("");
  const [isRecording, setIsRecording] = useState(false);

  // Mock location for now
  const fetchMockLocation = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLocation({
      latitude: 40.123 + Math.random() * 0.01,
      longitude: -111.123 + Math.random() * 0.01,
    });
    setLastUpdated(new Date().toLocaleTimeString());
  };

  const formatCoordinate = (coord: number) => coord.toFixed(6);
  const getTimeAgo = (timeString: string) => (timeString ? `Updated at ${timeString}` : "Never");

  // Initial fetch and 30-min auto-refresh
  useEffect(() => {
    fetchMockLocation();
    const interval = setInterval(fetchMockLocation, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const handleRecordingToggle = async () => {
    await fetchMockLocation();
    setIsRecording(prev => !prev);
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      {location && (
        <MapView
          style={{ position: "absolute", top: 0, bottom: 0, left: 0, right: 0 }}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
          showsUserLocation={false}
          showsMyLocationButton={false}
          showsCompass
          showsScale
        >
          {/* Static circle area */}
          <Circle
            center={location}
            radius={40}
            fillColor="rgba(0,122,255,0.12)"
            strokeColor="rgba(0,122,255,0.25)"
            strokeWidth={1}
          />

          {/* Static marker, no pulse */}
          <Marker coordinate={location} title="Student Location" description={getTimeAgo(lastUpdated)} flat>
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

      {/* Loading state when no location */}
      {!location && (
        <View className="flex-1 items-center justify-center bg-muted/20">
          <View className="w-16 h-16 rounded-full bg-primary/10 items-center justify-center mb-4">
            <MapPin className="text-primary" size={32} />
          </View>
          <Text className="text-foreground text-lg font-semibold mb-2">Loading Location...</Text>
          <Text className="text-muted-foreground text-center px-8">
            Please wait while we fetch the student's current location
          </Text>
        </View>
      )}

      {/* Bottom Info Panel */}
      <View className="absolute bottom-6 left-4 right-4">
        <Card className="shadow-xl border-0 bg-card/95 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <View style={{ marginRight: 5, marginTop: -2 }}>
                  <Navigation className="text-primary" size={20} />
                </View>
                <CardTitle className="text-lg text-foreground">Current Location</CardTitle>
              </View>
              <View className="flex-row items-center">
                <View style={{ marginRight: 5, marginTop: -2 }}>
                  <Clock className="text-muted-foreground" size={16} />
                </View>
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
                    <View className="bg-secondary rounded-lg px-3 py-2 border border-border mr-2">
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
                  <View className="flex-row items-center">
                    <Badge variant="default" className="mr-2">
                      <Text className="text-xs">Active</Text>
                    </Badge>
                    <Text className="text-muted-foreground text-sm">{getTimeAgo(lastUpdated)}</Text>
                  </View>
                </View>
              </>
            ) : (
              <View className="items-center py-4">
                <Text className="text-muted-foreground text-center">Location data unavailable</Text>
              </View>
            )}
          </CardContent>
        </Card>

        <View className="mt-4">
          <Button onPress={handleRecordingToggle} className="w-full h-12 rounded-md" size="default">
            <View className="flex-row items-center justify-center">
              <Text className="text-primary-foreground font-semibold mr-2">
                {isRecording ? "STOP RECORDING" : "GET GPS LOCATION & VOICE RECORDING"}
              </Text>
              {isRecording && (
                <Badge variant="destructive">
                  <Text className="text-xs">REC</Text>
                </Badge>
              )}
            </View>
          </Button>
        </View>
      </View>

      {/* Quick Actions */}
      <View className="absolute top-8 right-4 space-y-3">
        <Pressable className="w-12 h-12 rounded-full bg-card shadow-lg border border-border items-center justify-center">
          <RefreshCw className="text-foreground" size={20} />
        </Pressable>

        <Pressable className="w-12 h-12 rounded-full bg-card shadow-lg border border-border items-center justify-center mt-2">
          <Navigation className="text-foreground" size={20} />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
