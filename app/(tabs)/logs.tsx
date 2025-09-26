import React, { useState, useEffect } from "react";
import { View, Text, FlatList } from "react-native";
import LogItem from "../../components/Logitem";
import { useColorScheme } from "nativewind";
import { THEME } from "@/lib/theme";

interface Log {
  id: string;
  time: string;
  location: string;
  audioUrl: string;
}

export default function LogsScreen() {
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? "light"];

  const [logs, setLogs] = useState<Log[]>([]);

  useEffect(() => {
    // Mock data for now - Replace with Firebase fetch later
    const mockLogs: Log[] = [
      { id: "1", time: "12:23:41", location: "Near The University of Utah", audioUrl: "https://example.com/audio1.mp3" },
      { id: "2", time: "12:40:12", location: "Salt Lake City", audioUrl: "https://example.com/audio2.mp3" },
    ];
    setLogs(mockLogs);
  }, []);

  const handlePlay = (audioUrl: string) => {
    console.log("Play audio:", audioUrl);
    // Later integrate with Expo AV for audio playback
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background, padding: 15 }}>
      <Text style={{ color: theme.foreground, fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
        History
      </Text>

      <FlatList
        data={logs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <LogItem time={item.time} location={item.location} onPlay={() => handlePlay(item.audioUrl)} />
        )}
      />
    </View>
  );
}
