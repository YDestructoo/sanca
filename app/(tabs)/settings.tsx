import React, { useState } from "react";
import { View, ScrollView, Pressable, Alert, Modal, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuth } from "@/lib/auth-context";
import EmergencyAlertsToggle from "@/components/EmergencyAlertsToggle";

// React Native Reusables imports
import { Text } from "@/components/ui/text";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Icons
import { User, Lock, LogOut, Edit3, ChevronRight, X, Eye, EyeOff } from "lucide-react-native";

export default function SettingsScreen() {
  const { user, userProfile, signOut } = useAuth();
  const router = useRouter();
  
  // Modal states
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  
  // Form states
  const [newUsername, setNewUsername] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChangeUsername = () => {
    setNewUsername(username);
    setShowUsernameModal(true);
  };

  const handleChangePassword = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setShowPasswordModal(true);
  };

  const handleUpdateUsername = async () => {
    if (!newUsername.trim()) {
      Alert.alert("Error", "Please enter a username.");
      return;
    }
    
    if (newUsername.trim() === username) {
      Alert.alert("Info", "This is already your current username.");
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Implement actual username update in Firebase
      // For now, simulate the update
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      Alert.alert("Success", `Username updated to: ${newUsername.trim()}`);
      setShowUsernameModal(false);
      setNewUsername("");
    } catch (error) {
      Alert.alert("Error", "Failed to update username. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!currentPassword.trim()) {
      Alert.alert("Error", "Please enter your current password.");
      return;
    }
    
    if (!newPassword.trim()) {
      Alert.alert("Error", "Please enter a new password.");
      return;
    }
    
    if (newPassword.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters long.");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Implement actual password update in Firebase
      // For now, simulate the update
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      Alert.alert("Success", "Password updated successfully.");
      setShowPasswordModal(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      Alert.alert("Error", "Failed to update password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              await signOut();
              router.replace("/auth/login");
            } catch (error) {
              console.log("Logout error:", error);
              Alert.alert("Error", "Failed to logout. Please try again.");
            }
          },
        },
      ]
    );
  };

  // Get display name and email from user profile or Firebase user
  const displayName = userProfile?.studentName || userProfile?.username || user?.displayName || "User";
  const email = userProfile?.email || user?.email || "";
  const username = userProfile?.username || "N/A";
  
  // Mask email for privacy
  const maskedEmail = email ? email.replace(/(.{2}).*(@.*)/, "$1***$2") : "N/A";

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

        <View className="px-6 py-6">
          {/* Profile Card */}
          <Card className="shadow-sm border-border/50">
            <CardContent className="p-6">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center flex-1">
                  <View className="w-12 h-12 rounded-full bg-muted items-center justify-center mr-4">
                    <Text className="text-muted-foreground font-semibold">
                      {displayName.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-foreground font-semibold text-lg mb-2">
                      {displayName}
                    </Text>
                    <Text className="text-muted-foreground text-sm">
                      Username: {username}
                    </Text>
                  </View>
                </View>
                
                <Pressable
                  onPress={handleLogout}
                  className="w-12 h-12 rounded-lg items-center justify-center active:scale-95 border border-border"
                  style={{ backgroundColor: 'rgba(255,75,110,0.1)' }}
                >
                  <LogOut color="#FF5A7D" size={20} />
                </Pressable>
              </View>
            </CardContent>
          </Card>

          {/* Account Information Card */}
          <Card className="shadow-sm border-border/50 mt-6">
            <CardContent className="p-6">
              {/* Email Section */}
              <View className="flex-row items-center justify-between mb-6">
                <View className="flex-1">
                  <Text className="text-foreground font-medium mb-2">
                    Email Address:
                  </Text>
                  <Text className="text-muted-foreground text-sm">
                    {maskedEmail}
                  </Text>
                </View>
              </View>

              {/* Username Section */}
              <View className="flex-row items-center justify-between">
                <View className="flex-1 mr-4">
                  <Text className="text-foreground font-medium mb-2">
                    Username:
                  </Text>
                  <Text className="text-muted-foreground text-sm">
                    {username}
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
            <Card className="shadow-sm border-border/50 mt-6">
              <CardContent className="p-6">
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center flex-1">
                    <View className="w-10 h-10 items-center justify-center mr-4">
                      <Lock className="text-primary" size={24} />
                    </View>
                    <Text className="text-foreground font-medium">
                      Change Password
                    </Text>
                  </View>
                    <View className="w-10 h-10 items-center justify-center">
                      <ChevronRight className="text-muted-foreground" size={20} />
                    </View>
                </View>
              </CardContent>
            </Card>

          {/* Emergency Alerts Toggle - NOW OUTSIDE THE PRESSABLE */}  
          <View className="mt-6">
            <EmergencyAlertsToggle />
          </View>
          </Pressable>
          {/* Footer */}
          <View className="mt-12 pt-8 border-t border-border">
            <Text className="text-muted-foreground text-center text-xs">
              Sanca Student Tracker
            </Text>
            <Text className="text-muted-foreground text-center text-xs mt-2">
              Version 1.0.0
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Username Edit Modal */}
      <Modal
        visible={showUsernameModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView className="flex-1 bg-background">
          <View className="flex-row items-center justify-between p-6 border-b border-border">
            <Text className="text-lg font-semibold">Change Username</Text>
            <Pressable
              onPress={() => setShowUsernameModal(false)}
              className="w-8 h-8 rounded-full bg-muted items-center justify-center"
            >
              <X size={20} />
            </Pressable>
          </View>
          
          <View className="p-6">
            <View className="mb-8">
              <Text className="text-sm font-medium mb-3">New Username</Text>
              <Input
                value={newUsername}
                onChangeText={setNewUsername}
                placeholder="Enter new username"
                className="w-full"
              />
            </View>
            
            <View>
              <Button
                onPress={handleUpdateUsername}
                disabled={isLoading}
                className="w-full h-12 mb-4"
              >
                <Text className="text-primary-foreground font-semibold">
                  {isLoading ? "Updating..." : "Update Username"}
                </Text>
              </Button>
              
              <Button
                onPress={() => setShowUsernameModal(false)}
                variant="outline"
                className="w-full h-12"
              >
                <Text className="text-foreground">Cancel</Text>
              </Button>
            </View>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Password Change Modal */}
      <Modal
        visible={showPasswordModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView className="flex-1 bg-background">
          <View className="flex-row items-center justify-between p-6 border-b border-border">
            <Text className="text-lg font-semibold">Change Password</Text>
            <Pressable
              onPress={() => setShowPasswordModal(false)}
              className="w-8 h-8 rounded-full bg-muted items-center justify-center"
            >
              <X size={20} />
            </Pressable>
          </View>
          
          <ScrollView className="flex-1 p-6" showsVerticalScrollIndicator={false}>
            <View>
              {/* Current Password */}
              <View className="mb-6">
                <Text className="text-sm font-medium mb-3">Current Password</Text>
                <View className="relative">
                  <Input
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                    placeholder="Enter current password"
                    secureTextEntry={!showCurrentPassword}
                    className="w-full pr-12"
                  />
                  <Pressable
                    onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-3"
                  >
                    {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </Pressable>
                </View>
              </View>

              {/* New Password */}
              <View className="mb-6">
                <Text className="text-sm font-medium mb-3">New Password</Text>
                <View className="relative">
                  <Input
                    value={newPassword}
                    onChangeText={setNewPassword}
                    placeholder="Enter new password"
                    secureTextEntry={!showNewPassword}
                    className="w-full pr-12"
                  />
                  <Pressable
                    onPress={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-3"
                  >
                    {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </Pressable>
                </View>
              </View>

              {/* Confirm Password */}
              <View className="mb-8">
                <Text className="text-sm font-medium mb-3">Confirm New Password</Text>
                <View className="relative">
                  <Input
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="Confirm new password"
                    secureTextEntry={!showConfirmPassword}
                    className="w-full pr-12"
                  />
                  <Pressable
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </Pressable>
                </View>
              </View>
              
              <View>
                <Button
                  onPress={handleUpdatePassword}
                  disabled={isLoading}
                  className="w-full h-12 mb-4"
                >
                  <Text className="text-primary-foreground font-semibold">
                    {isLoading ? "Updating..." : "Update Password"}
                  </Text>
                </Button>
                
                <Button
                  onPress={() => setShowPasswordModal(false)}
                  variant="outline"
                  className="w-full h-12"
                >
                  <Text className="text-foreground">Cancel</Text>
                </Button>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}