import React, { useState, useEffect, useCallback } from "react";
import { View, FlatList, Pressable, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "@/components/ui/text";
import { History } from "lucide-react-native";
import LogItem from "@/components/Logitem";
import { useAuth } from "@/lib/auth-context";
import { formatToPhilippineTime, formatDateLabel } from "@/lib/time-utils";

// Firebase
import { db } from "@/firebaseConfig";
import { collection, onSnapshot, query, orderBy, doc, updateDoc } from "firebase/firestore";

interface Log {
  id: string;
  time: string;
  location: string;
  date?: string;
}

// Reverse Geocode using OpenStreetMap
const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
  try {
    if (!lat || !lng || isNaN(lat) || isNaN(lng)) return `${lat}, ${lng}`;

    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
      {
        headers: {
          "User-Agent": "StudentTrackerApp/1.0",
        },
      }
    );

    const data = await res.json();
    return data?.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  } catch (error) {
    console.error("Reverse Geocoding failed:", error);
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  }
};

// Date Label Formatter is now imported from time-utils

export default function LogsScreen() {
  const { userProfile } = useAuth();
  const token = userProfile?.adminToken || userProfile?.uid || "";
  const [logs, setLogs] = useState<Log[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<"all" | "today" | "week">("all");
  const [error, setError] = useState<string | null>(null);

  // Filter labels for display
  const filterLabels: Record<typeof filter, string> = {
    all: "All Time",
    today: "Today",
    week: "This Week",
  };

  // Fetch logs with caching
  useEffect(() => {
    if (!token) {
      setError("No user token available");
      return;
    }

    setError(null);
    const logsRef = collection(db, "data", token, "logs");
    const q = query(logsRef, orderBy("timestamp", "desc"));

    let isMounted = true;

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      if (!isMounted) return;

      try {
        const newLogs: Log[] = [];

        for (const docSnap of snapshot.docs) {
          const data = docSnap.data();
          const lat = parseFloat(data.latitude);
          const lng = parseFloat(data.longitude);

          let address = data.address;

          // Fetch and cache address if missing
          if (!address && !isNaN(lat) && !isNaN(lng)) {
            try {
              address = await reverseGeocode(lat, lng);
              if (isMounted) {
                await updateDoc(doc(db, "data", token, "logs", docSnap.id), {
                  address: address,
                });
              }
            } catch (geocodeError) {
              console.warn("Geocoding failed for log:", docSnap.id, geocodeError);
              address = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
            }
          }

          newLogs.push({
            id: docSnap.id,
            time: data.time || formatToPhilippineTime(data.timestamp),
            location: address || `${lat}, ${lng}`,
            date: data.timestamp || new Date().toISOString(),
          });
        }

        if (isMounted) {
          setLogs(newLogs);
          setError(null);
        }
      } catch (err) {
        console.error("Error processing logs:", err);
        if (isMounted) {
          setError("Failed to load location logs");
        }
      }
    }, (err) => {
      console.error("Firestore error:", err);
      if (isMounted) {
        setError("Failed to connect to database");
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [token]);

  // Pull-to-refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  // Filter logs by date
  const getFilteredLogs = () => {
    if (filter === "all") return logs;
    const now = new Date();
    return logs.filter((log) => {
      if (!log.date) return false;
      const d = new Date(log.date);
      if (filter === "today") {
        return (
          d.getFullYear() === now.getFullYear() &&
          d.getMonth() === now.getMonth() &&
          d.getDate() === now.getDate()
        );
      }
      if (filter === "week") {
        const msInWeek = 7 * 24 * 60 * 60 * 1000;
        return now.getTime() - d.getTime() <= msInWeek;
      }
      return false;
    });
  };

  // Empty State UI
  const renderEmptyState = () => (
    <View className="flex-1 items-center justify-center py-20">
      <View className="w-20 h-20 rounded-full bg-muted items-center justify-center mb-6">
        <History className="text-muted-foreground" size={36} />
      </View>
      <Text className="text-foreground text-xl font-semibold mb-2">No History Yet</Text>
      <Text className="text-muted-foreground text-center px-8 leading-6">
        Location history will appear here when tracking starts.
      </Text>
    </View>
  );

  // Error State UI
  const renderErrorState = () => (
    <View className="flex-1 items-center justify-center py-20">
      <View className="w-20 h-20 rounded-full bg-destructive/10 items-center justify-center mb-6">
        <History className="text-destructive" size={36} />
      </View>
      <Text className="text-foreground text-xl font-semibold mb-2">Error Loading Data</Text>
      <Text className="text-muted-foreground text-center px-8 leading-6 mb-4">
        {error}
      </Text>
      <Pressable
        onPress={() => {
          setError(null);
          // Trigger refresh
        }}
        className="bg-primary px-6 py-3 rounded-lg"
      >
        <Text className="text-primary-foreground font-medium">Try Again</Text>
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Filter Tabs */}
      <View className="flex-row px-6 py-3 bg-card border-b border-border">
        {(["all", "today", "week"] as const).map((filterType) => (
          <Pressable
            key={filterType}
            onPress={() => setFilter(filterType)}
            className={`px-4 py-2 rounded-full mr-2 items-center justify-center ${
              filter === filterType ? "bg-primary" : "bg-secondary"
            }`}
            style={{ minWidth: 92 }}
          >
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              className={`text-sm font-medium text-center ${
                filter === filterType
                  ? "text-primary-foreground"
                  : "text-secondary-foreground"
              }`}
            >
              {filterLabels[filterType]}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Logs List */}
      <View className="flex-1 px-6">
        {error ? (
          renderErrorState()
        ) : logs.length === 0 ? (
          renderEmptyState()
        ) : (
          <FlatList
            data={getFilteredLogs()}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <LogItem
                time={item.time}
                location={item.location}
                date={formatDateLabel(item.date)}
                onPlay={() => console.log("View log:", item.id)}
              />
            )}
            contentContainerStyle={{ paddingVertical: 16 }}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={["#007AFF"]}
                tintColor="#007AFF"
              />
            }
          />
        )}
      </View>

      {/* Quick Stats */}
      {logs.length > 0 && (
        <View className="px-1 py-4 bg-card border-t border-border">
          <View className="flex-row">
            <View className="flex-1 items-center px-1">
              <Text className="text-muted-foreground text-xs text-center" numberOfLines={1}>
                TOTAL LOGS
              </Text>
              <Text className="text-foreground font-semibold text-sm mt-1">{logs.length}</Text>
            </View>

            <View className="flex-1 items-center px-1">
              <Text className="text-muted-foreground text-xs text-center" numberOfLines={1}>
                THIS WEEK
              </Text>
              <Text className="text-foreground font-semibold text-sm mt-1">
                {
                  logs.filter((log) => {
                    if (!log.date) return false;
                    const d = new Date(log.date);
                    const now = new Date();
                    const msInWeek = 7 * 24 * 60 * 60 * 1000;
                    return now.getTime() - d.getTime() <= msInWeek;
                  }).length
                }
              </Text>
            </View>

            <View className="flex-1 items-center px-1">
              <Text className="text-muted-foreground text-xs text-center" numberOfLines={1}>
                LAST UPDATED
              </Text>
              <Text className="text-foreground font-semibold text-sm mt-1">
                {logs[0]?.time || "--:--"}
              </Text>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
