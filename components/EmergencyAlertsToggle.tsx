import React, { useEffect, useState, useRef } from "react";
import { View, Switch } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Text } from "@/components/ui/text";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/lib/auth-context";
import { setupNotifications } from "@/lib/notifications";
import { listenEmergency } from "@/lib/emergencyListener";
import { ThemedIcon } from "@/components/ui/ThemeIcon";

const PREF_KEY = "@sanca:emergencyEnabled";

export default function EmergencyAlertsToggle() {
  const { userProfile } = useAuth();
  const adminToken = userProfile?.adminToken ?? null;

  const [enabled, setEnabled] = useState(true);
  const stopRef = useRef<(() => void)>(() => {});

  // Load saved toggle preference
  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem(PREF_KEY);
      if (saved !== null) setEnabled(saved === "1");
    })();
  }, []);

  // Subscribe/unsubscribe when adminToken or toggle changes
  useEffect(() => {
    stopRef.current?.(); // stop old listener if any

    if (!adminToken || !enabled) return;

    (async () => {
      const granted = await setupNotifications();
      if (!granted) {
        setEnabled(false);
        await AsyncStorage.setItem(PREF_KEY, "0");
        return;
      }

      stopRef.current = listenEmergency(adminToken, true);
    })();

    return () => stopRef.current?.();
  }, [adminToken, enabled]);

  // Persist toggle preference
  useEffect(() => {
    AsyncStorage.setItem(PREF_KEY, enabled ? "1" : "0");
  }, [enabled]);

  return (
    <Card className="shadow-sm border-border/50">
      <CardContent className="px-6 py-3">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1 mr-4">
            <View className="w-10 h-10 items-center justify-center mr-4">
              <ThemedIcon name="Bell" size={24} colorKey="primary" />
            </View>
            <View className="flex-1">
              <Text className="text-foreground font-medium">
                Emergency Alerts
              </Text>
              <Text className="text-muted-foreground text-sm mt-1">
                Receive notifications for emergencies
              </Text>
            </View>
          </View>
          <Switch 
            value={enabled} 
            onValueChange={setEnabled}
            trackColor={{ false: '#d1d5db', true: '#10b981' }}
            thumbColor={enabled ? '#ffffff' : '#f3f4f6'}
          />
        </View>
      </CardContent>
    </Card>
  );
}