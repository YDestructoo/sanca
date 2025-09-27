import React, { useState, useEffect } from "react";
import { View, FlatList, Pressable, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// React Native Reusables imports
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Icons
import { Play, Clock, MapPin, History, Calendar, Filter, Search } from "lucide-react-native";
import LogItem from '@/components/Logitem';

interface Log {
  id: string;
  time: string;
  location: string;
  audioUrl: string;
  date?: string;
  duration?: string;
}

// Helper: turn ISO date strings into friendly labels for display while keeping the
// original ISO for accurate filtering.
const formatDateLabel = (dateString?: string) => {
  if (!dateString) return '';
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return dateString;
  const now = new Date();
  const msInDay = 24 * 60 * 60 * 1000;
  const diffDays = Math.floor((now.getTime() - d.getTime()) / msInDay);
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  const weeks = Math.floor(diffDays / 7);
  return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
};

// Using shared LogItem component from components/Logitem.tsx

export default function LogsScreen() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<"all" | "today" | "week">("all");

  // Generate mock data with more variety
  const generateMockLogs = (): Log[] => {
    const locations = [
      "Near The University of Utah",
      "Salt Lake City Downtown",
      "Liberty Park Area",
      "Sugar House District",
      "Millcreek Common",
      "The Gateway Mall",
      "Temple Square",
      "City Creek Center"
    ];
    
    const times = ["12:23:41", "14:15:32", "09:45:18", "16:30:25", "11:12:07", "13:55:43"];
    // Use ISO date strings for accurate filtering: Today, Yesterday, within week, older
    const now = new Date();
    const toISO = (d: Date) => d.toISOString();
    const dates = [
      toISO(now), // Today
      toISO(new Date(now.getTime() - 24 * 60 * 60 * 1000)), // Yesterday
      toISO(new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000)),
      toISO(new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000)),
      toISO(new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000)), // Older than a week
    ];
    const durations = ["0:45", "1:23", "0:32", "2:15", "0:58", "1:07"];
    
    return Array.from({ length: 8 }, (_, index) => ({
      id: `${index + 1}`,
      time: times[index % times.length],
      location: locations[index % locations.length],
      audioUrl: `https://example.com/audio${index + 1}.mp3`,
      // store both ISO date and a human label for display
      date: dates[index % dates.length],
      duration: durations[index % durations.length]
    }));
  };

  useEffect(() => {
    setLogs(generateMockLogs());
  }, []);

  const handlePlay = (audioUrl: string) => {
    console.log("Play audio:", audioUrl);
    // Later integrate with Expo AV for audio playbook
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate network request
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLogs(generateMockLogs());
    setRefreshing(false);
  };

  const getFilteredLogs = () => {
    if (filter === 'all') return logs;

    const now = new Date();
    return logs.filter((log) => {
      if (!log.date) return false;
      const d = new Date(log.date);
      if (filter === 'today') {
        return (
          d.getFullYear() === now.getFullYear() &&
          d.getMonth() === now.getMonth() &&
          d.getDate() === now.getDate()
        );
      }

      if (filter === 'week') {
        const msInWeek = 7 * 24 * 60 * 60 * 1000;
        return now.getTime() - d.getTime() <= msInWeek;
      }

      return false;
    });
  };

  const renderEmptyState = () => (
    <View className="flex-1 items-center justify-center py-20">
      <View className="w-20 h-20 rounded-full bg-muted items-center justify-center mb-6">
        <History className="text-muted-foreground" size={36} />
      </View>
      <Text className="text-foreground text-xl font-semibold mb-2">No History Yet</Text>
      <Text className="text-muted-foreground text-center px-8 leading-6">
        Your location history and audio logs will appear here once you start tracking.
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
              filter === filterType ? 'bg-primary' : 'bg-secondary'
            }`}
            style={{ minWidth: 92 }}
          >
            <Text numberOfLines={1} ellipsizeMode="tail" className={`text-sm font-medium text-center ${
              filter === filterType ? 'text-primary-foreground' : 'text-secondary-foreground'
            }`}>
              {filterType === 'all' ? 'All Time' : 
               filterType === 'today' ? 'Today' : 'This Week'}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* List Content */}
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
                date={item.date}
                duration={item.duration}
                onPlay={() => handlePlay(item.audioUrl)}
              />
            )}
            contentContainerStyle={{ paddingVertical: 16 }}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={['#007AFF']} // iOS style
                tintColor="#007AFF"
              />
            }
          />
        )}
      </View>

      {/* Quick Stats Footer */}
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
                {logs.filter((log) => {
                  if (!log.date) return false;
                  const d = new Date(log.date);
                  const now = new Date();
                  const msInWeek = 7 * 24 * 60 * 60 * 1000;
                  return now.getTime() - d.getTime() <= msInWeek;
                }).length}
              </Text>
            </View>
            
            <View className="items-center">
              <Text className="text-muted-foreground text-xs">LAST UPDATE</Text>
              <Text className="text-foreground font-semibold">
                {logs[0]?.time || '--:--'}
              </Text>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}