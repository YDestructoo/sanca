import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Play } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { THEME } from "@/lib/theme";

interface LogItemProps {
  time: string;
  location: string;
  onPlay: () => void;
}

export default function LogItem({ time, location, onPlay }: LogItemProps) {
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? "light"];

  return (
    <View
      style={{
        backgroundColor: theme.card,
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <View>
        <Text style={{ color: theme.foreground, fontWeight: "bold", fontSize: 16 }}>{time}</Text>
        <Text style={{ color: theme.mutedForeground, fontSize: 14 }}>Last Seen at:</Text>
        <Text style={{ color: theme.foreground, fontSize: 14 }}>{location}</Text>
      </View>
      <TouchableOpacity onPress={onPlay}>
        <Play size={24} color={theme.foreground} />
      </TouchableOpacity>
    </View>
  );
}
