import React from "react";
import { View } from "react-native";

// React Native Reusables imports
import { Text } from "@/components/ui/text";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Icons
import { Clock, MapPin } from "lucide-react-native";

interface LogItemProps {
  time: string;
  location: string;
  date?: string;
  duration?: string;
  onPlay: () => void;
}

export default function LogItem({ time, location, date, duration }: LogItemProps) {
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

  return (
    <Card className="mb-3 shadow-sm border border-border/50">
      <CardContent className="p-4">
        <View className="flex-col">
          {/* Time Row */}
          <View className="flex-row items-center justify-between mb-2">
            <View className="flex-row items-center" style={{ gap: 8 }}> 
              {/* Gap works like spacing between children */}
              <Clock className="text-primary" size={18} />
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
