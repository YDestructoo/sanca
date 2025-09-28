import React, { useState, useEffect, useCallback } from "react";
import { View, FlatList, Pressable, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "@/components/ui/text";
import { History } from "lucide-react-native";
import LogItem from "@/components/Logitem";

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

// Date Label Formatter
const formatDateLabel = (dateString?: string) => {
  if (!dateString) return "";
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return dateString;
  const now = new Date();
  const msInDay = 24 * 60 * 60 * 1000;
  const diffDays = Math.floor((now.getTime() - d.getTime()) / msInDay);
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  const weeks = Math.floor(diffDays / 7);
  return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;
};

export default function LogsScreen() {
  const token = "abc123XYZ"; // TODO: Replace with dynamic token
  const [logs, setLogs] = useState<Log[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<"all" | "today" | "week">("all");

  // Filter labels for display
  const filterLabels: Record<typeof filter, string> = {
    all: "All Time",
    today: "Today",
    week: "This Week",
  };

  // Fetch logs with caching
  useEffect(() => {
    const logsRef = collection(db, "data", token, "logs");
    const q = query(logsRef, orderBy("timestamp", "desc"));

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const newLogs: Log[] = [];

      for (const docSnap of snapshot.docs) {
        const data = docSnap.data();
        const lat = parseFloat(data.latitude);
        const lng = parseFloat(data.longitude);

        let address = data.address;

        // Fetch and cache address if missing
        if (!address && !isNaN(lat) && !isNaN(lng)) {
          address = await reverseGeocode(lat, lng);
          await updateDoc(doc(db, "data", token, "logs", docSnap.id), {
            address: address,
          });
        }

        newLogs.push({
          id: docSnap.id,
          time: data.time || new Date(data.timestamp).toLocaleTimeString(),
          location: address || `${lat}, ${lng}`,
          date: data.timestamp || new Date().toISOString(),
        });
      }

      setLogs(newLogs);
    });

    return () => unsubscribe();
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
        {logs.length === 0 ? (
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
        <View className="px-6 py-4 bg-card border-t border-border">
          <View className="flex-row justify-between items-center">
            <View className="items-center">
              <Text className="text-muted-foreground text-xs">TOTAL LOGS</Text>
              <Text className="text-foreground font-semibold">{logs.length}</Text>
            </View>

            <View className="items-center">
              <Text className="text-muted-foreground text-xs">THIS WEEK</Text>
              <Text className="text-foreground font-semibold">
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

            <View className="items-center">
              <Text className="text-muted-foreground text-xs">LAST UPDATE</Text>
              <Text className="text-foreground font-semibold">
                {logs[0]?.time || "--:--"}
              </Text>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
