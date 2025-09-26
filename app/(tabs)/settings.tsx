import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useColorScheme } from "nativewind";
import { THEME } from "@/lib/theme";
import { User, Mail, Lock, LogOut, Pencil } from "lucide-react-native";

export default function SettingsScreen() {
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? "light"];

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
    <ScrollView style={{ flex: 1, backgroundColor: theme.background, padding: 16 }}>
      {/* App Title */}
      <Text style={{ color: theme.foreground, fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
        Sanca
      </Text>

      {/* Profile Section */}
      <View
        style={{
          backgroundColor: theme.card,
          padding: 16,
          borderRadius: 10,
          marginBottom: 16,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View>
          <Text style={{ color: theme.foreground, fontSize: 18, fontWeight: "bold" }}>Lorem Ipsum</Text>
          <Text style={{ color: theme.mutedForeground }}>Username: Lorem Ipsum</Text>
        </View>
        <TouchableOpacity onPress={handleLogout}>
          <LogOut size={20} color={theme.destructive} />
        </TouchableOpacity>
      </View>

      {/* Email + Username Section */}
      <View
        style={{
          backgroundColor: theme.card,
          padding: 16,
          borderRadius: 10,
          marginBottom: 16,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <Text style={{ color: theme.foreground, fontSize: 14 }}>
            Email Address: {"\n"}L********@gmail.com
          </Text>
          <TouchableOpacity onPress={handleChangeEmail}>
            <Pencil size={20} color={theme.foreground} />
          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={{ color: theme.foreground, fontSize: 14 }}>Username: Lorem Ipsum</Text>
          <TouchableOpacity onPress={handleChangeUsername}>
            <Pencil size={20} color={theme.foreground} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Change Password Section */}
      <TouchableOpacity
        onPress={handleChangePassword}
        style={{
          backgroundColor: theme.card,
          padding: 16,
          borderRadius: 10,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Lock size={20} color={theme.foreground} />
          <Text style={{ color: theme.foreground, fontSize: 14 }}>Change Password</Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
}
