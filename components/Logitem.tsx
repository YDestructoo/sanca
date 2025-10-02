import React from "react";
import { View } from "react-native";

// React Native Reusables imports
import { Text } from "@/components/ui/text";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDateLabel } from "@/lib/time-utils";
   
// Icons
import { ThemedIcon } from "@/components/ui/ThemeIcon";

interface LogItemProps {
  time: string;
  location: string;
  date?: string;
  duration?: string;
  onPlay: () => void;
}

export default function LogItem({ time, location, date, duration }: LogItemProps) {
  // formatDateLabel is now imported from time-utils

  return (
    <Card className="mb-3 shadow-sm border border-border/50">
      <CardContent className="p-4">
        <View className="flex-col">
          {/* Time Row */}
          <View className="flex-row items-center justify-between mb-2">
            <View className="flex-row items-center" style={{ gap: 8 }}> 
              {/* Gap works like spacing between children */}
              <ThemedIcon name="Clock" size={18} colorKey="primary" />
              <Text className="text-foreground font-semibold text-lg">{time}</Text>
            </View>
            {date && (
              <Badge variant="secondary" className="px-2 py-0.5">
                <Text className="text-xs">{formatDateLabel(date)}</Text>
              </Badge>
            )}
          </View>

          {/* Last Seen Label */}
          <Text className="text-muted-foreground text-xs font-medium mb-1 mt-1">
            LAST SEEN AT:
          </Text>

          {/* Location Row */}
          <View className="flex-row items-start mt-1" style={{ gap: 8 }}>
            <Text className="text-foreground text-sm flex-1 font-medium">
              {location}
            </Text>
          </View>

          {/* Duration Row */}
          {duration && (
            <View className="mt-2">
              <Text className="text-muted-foreground text-xs">
                Duration: {duration}
              </Text>
            </View>
          )}
        </View>
      </CardContent>
    </Card>
  );
}