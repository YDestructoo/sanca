import React, { useState } from "react";
import { View, ScrollView, KeyboardAvoidingView, Platform, Pressable } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

// React Native Reusables imports
import { Text } from "@/components/ui/text";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Icons (assuming you have lucide-react-native or similar)
import { Eye, EyeOff, ArrowRight, LogIn } from "lucide-react-native";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Mock logic: store token for logged-in state
      await AsyncStorage.setItem("auth_token", "mock_token");
      router.replace("/map");
    } catch (err) {
      setError("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          className="flex-1"
        >
          {/* Header Section */}
          <View className="flex-1 justify-center px-6 py-8">
            
            {/* Logo/Brand Area */}
            <View className="items-center mb-3">
              <View className="w-20 h-20 rounded-2xl bg-primary items-center justify-center shadow-lg mb-6">
                <LogIn className="text-primary-foreground" size={32} />
              </View>
              <Text className="text-4xl font-bold text-foreground mb-3">Welcome Back</Text>
              <Text className="text-muted-foreground text-center text-lg px-4 leading-6">
                Sign in to continue your journey
              </Text>
            </View>

            {/* Main Card */}
            <Card className="w-full shadow-lg">
              <CardHeader className="Sign In">
                <CardTitle className="text-2xl text-center text-foreground">Sign In</CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-2">
                {/* Error Message */}
                {error ? (
                  <View className="bg-destructive/10 border border-destructive/20 rounded-lg px-4 py-3 mb-2">
                    <Text className="text-destructive text-sm text-center font-medium">{error}</Text>
                  </View>
                ) : null}

                {/* Email Input */}
                <View className="space-y-2">
                  <Text className="text-foreground font-medium text-base left-2">Email</Text>
                  <View className="relative">
                    <Input
                      placeholder="Enter your email"
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoComplete="email"
                      textContentType="emailAddress"
                      className="h-12 pl-4 text-base bg-card border-border focus:border-ring"
                    />
                  </View>
                </View>

                {/* Password Input */}
                <View className="space-y-2 mt-2">
                  <Text className="text-foreground font-medium text-base left-2">Password</Text>
                  <View className="relative">
                    <Input
                      placeholder="Enter your password"
                      secureTextEntry={!showPassword}
                      value={password}
                      onChangeText={setPassword}
                      autoComplete="current-password"
                      textContentType="password"
                      className="h-12 pl-4 pr-10 text-base bg-card border-border focus:border-ring"
                    />
                    <Pressable
                      onPress={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-3.5"
                    >
                      {showPassword ? (
                        <EyeOff size={20} className="text-muted-foreground" />
                      ) : (
                        <Eye size={20} className="text-muted-foreground" />
                      )}
                    </Pressable>
                  </View>
                </View>

                {/* Forgot Password */}
                <View className="items-start">
                  <Pressable>
                    <Text className="text-primary font-medium left-2.5  top-1">Forgot Password?</Text>
                  </Pressable>
                </View>

                {/* Login Button */}
                <Button
                  onPress={handleLogin}
                  disabled={isLoading}
                  className="h-12 mt-3.5"
                  size="lg"
                >
                  <View className="flex-row items-center">
                    <Text className="text-primary-foreground font-semibold text-base mr-2">
                      {isLoading ? "Signing In..." : "Sign In"}
                    </Text>
                    {!isLoading && <ArrowRight size={16} className="text-primary-foreground color" />}
                  </View>
                </Button>
              </CardContent>
            </Card>

            {/* Bottom Section */}
            <View className="mt-7">
              {/* Divider */}
              <View className="flex-row items-center my-8">
                <View className="flex-1 h-px bg-border" />
                <Text className="mx-4 text-muted-foreground text-sm">or continue with</Text>
                <View className="flex-1 h-px bg-border" />
              </View>

              {/* Register Button */}
              <Button
                variant="outline"
                onPress={() => router.push("/auth/register")}
                className="h-12"
                size="lg"
              >
                <Text className="font-semibold text-base">Create New Account</Text>
              </Button>

              {/* Terms */}
              <Text className="text-xs text-muted-foreground text-center mt-6 px-4 leading-4">
                By continuing, you agree to our{" "}
                <Text className="text-primary">Terms of Service</Text> and{" "}
                <Text className="text-primary">Privacy Policy</Text>
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}