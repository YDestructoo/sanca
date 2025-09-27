import React from "react";
import { View, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// React Native Reusables imports
import { Text } from "@/components/ui/text";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// Icons
import { User, Mail, Lock, LogOut, Edit3, ChevronRight, Settings } from "lucide-react-native";

export default function SettingsScreen() {
  const handleChangeEmail = () => {
    console.log("Change Email clicked");
    // TODO: Implement email change with Firebase or backend
  };

  const handleChangeUsername = () => {
    console.log("Change Username clicked");
    // TODO: Implement username change
  };

  const handleChangePassword = () => {
    console.log("Change Password clicked");
    // TODO: Implement password change
  };

  const handleLogout = () => {
    console.log("Logout clicked");
    // TODO: Implement logout
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row items-center px-6 py-4 bg-card border-b border-border">
          <View className="w-12 h-12 rounded-2xl bg-muted items-center justify-center mr-4">
            <Text className="text-foreground font-bold text-xl">S</Text>
          </View>
          <Text className="text-foreground font-bold text-3xl">Sanca</Text>
        </View>

        <View className="px-6 py-6 space-y-4">
          {/* Profile Card */}
          <Card className="shadow-sm border-border/50">
            <CardContent className="p-4">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center flex-1">
                  <View className="w-12 h-12 rounded-full bg-muted items-center justify-center mr-4">
                    <User className="text-muted-foreground" size={24} />
                  </View>
                  <View className="flex-1">
                    <Text className="text-foreground font-semibold text-lg mb-1">
                      Lorem Ipsum
                    </Text>
                    <Text className="text-muted-foreground text-sm">
                      Username: Lorem Ipsum
                    </Text>
                  </View>
                </View>
                
                <Pressable
                  onPress={handleLogout}
                  className="w-12 h-12 rounded-lg items-center justify-center active:scale-95 border border-border mr-2"
                  style={{ backgroundColor: 'rgba(255,75,110,0.1)' }}
                >
                  <LogOut color="#FF5A7D" size={20} />
                </Pressable>
              </View>
            </CardContent>
          </Card>

          {/* Account Information Card */}
          <Card className="shadow-sm border-border/50">
            <CardContent className="p-4 space-y-4">
              {/* Email Section */}
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <Text className="text-foreground font-medium mb-1">
                    Email Address:
                  </Text>
                  <Text className="text-muted-foreground text-sm">
                    L********@gmail.com
                  </Text>
                </View>
                
                <Pressable
                  onPress={handleChangeEmail}
                  className="w-10 h-10 items-center justify-center active:scale-95"
                >
                  <Edit3 className="text-secondary-foreground" size={18} />
                </Pressable>
              </View>

              {/* Username Section */}
              <View className="flex-row items-center justify-between mt-3">
                <View className="flex-1">
                  <Text className="text-foreground font-medium mb-1">
                    Username:
                  </Text>
                  <Text className="text-muted-foreground text-sm">
                    Lorem Ipsum
                  </Text>
                </View>
                
                <Pressable
                  onPress={handleChangeUsername}
                  className="w-10 h-10 items-center justify-center active:scale-95">
                  <Edit3 className="text-secondary-foreground" size={18} />
                </Pressable>
              </View>
            </CardContent>
          </Card>

          {/* Change Password Card */}
          <Pressable onPress={handleChangePassword}>
            <Card className="shadow-sm border-border/50">
              <CardContent className="p-2">
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center flex-1">
                    <View className="w-10 h-10 items-center justify-center mr-1 ml-2">
                      <Lock className="text-primary" size={24} />
                    </View>
                    <Text className="text-foreground font-medium">
                      Change Password
                    </Text>
                  </View>
                    <View className="w-10 h-10 items-center justify-center mr-1">
                      <ChevronRight className="text-muted-foreground mr-2" size={20} />
                    </View>
                </View>
              </CardContent>
            </Card>
          </Pressable>
          {/* Footer */}
          <View className="mt-8 pt-6 border-t border-border">
            <Text className="text-muted-foreground text-center text-xs">
              Sanca Student Tracker
            </Text>
            <Text className="text-muted-foreground text-center text-xs mt-1">
              Version 1.0.0
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}