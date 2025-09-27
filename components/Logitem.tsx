import React from "react";
import { View, Pressable } from "react-native";

// React Native Reusables imports
import { Text } from "@/components/ui/text";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Icons
import { Play, Clock, MapPin } from "lucide-react-native";

interface LogItemProps {
  time: string;
  location: string;
  date?: string;
  duration?: string;
  onPlay: () => void;
}

export default function LogItem({ time, location, date, duration, onPlay }: LogItemProps) {
  // Local helper to format ISO date strings into friendly labels
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
  return (
    <Card className="mb-3 shadow-sm border-border/50">
      <CardContent className="p-4">
        <View className="flex-row items-center">
          <View className="flex-1 mr-4">
            {/* Time and Date */}
            <View className="flex-row items-center mb-2 justify-start">
                <View className="flex-row items-center flex-1">
                  {/* Fixed-width icon column to force separation */}
                    <View style={{ width: 34 }} className="items-center">
                    <Clock className="text-primary" size={20} />
                  </View>

                  <Text className="text-foreground font-semibold text-lg flex-shrink">
                    {time}
                  </Text>

                  {date && (
                    <View className="ml-2">
                      <Badge variant="secondary" className="px-2 py-0.5">
                        <Text className="text-xs">{formatDateLabel(date)}</Text>
                      </Badge>
                    </View>
                  )}
                </View>
            </View>
            
            {/* Last Seen Label */}
            <Text className="text-muted-foreground text-xs font-medium mb-1 ml-6">
              LAST SEEN AT:
            </Text>
            
            {/* Location */}
            <View className="flex-row items-center mb-2 ml-6">
              <MapPin className="text-muted-foreground mr-2" size={14} />
              <Text className="text-foreground text-sm flex-1 font-medium" numberOfLines={2}>
                {location}
              </Text>
            </View>
            
            {/* Duration if available */}
            {duration && (
              <View className="flex-row items-center ml-6">
                <Text className="text-muted-foreground text-xs">
                  Duration: {duration}
                </Text>
              </View>
            )}
          </View>
          
          <View className="flex-row items-center">
            {/* Play Button - subtle rounded square */}
            <Pressable
              onPress={onPlay}
              accessibilityRole="button"
              className="w-12 h-12 items-center justify-center shadow-sm active:scale-95 bg-card border border-border rounded-lg"
              style={{
                borderRadius: 12,
              }}
            >
              <Play className="text-primary" size={18} />
            </Pressable>
          </View>
        </View>
      </CardContent>
    </Card>
  );
}