import React, { useState } from "react";
import { View, ScrollView, KeyboardAvoidingView, Platform, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "@/components/ui/text";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, ArrowRight, UserPlus, Key } from "lucide-react-native";

// Firebase imports
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "@/firebaseConfig"; // adjust path if needed

export default function RegisterScreen() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [studentName, setStudentName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showToken, setShowToken] = useState(false);
  const router = useRouter();

  const handleRegister = async () => {
    if (!username || !email || !password || !token || !studentName) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // 1. Check if token exists & is valid
      const tokenRef = doc(db, "adminTokens", token);
      const tokenSnap = await getDoc(tokenRef);

      if (!tokenSnap.exists() || !tokenSnap.data().active || tokenSnap.data().assigned) {
        setError("Invalid or already used token");
        setIsLoading(false);
        return;
      }

      // 2. Create user in Firebase Auth
      const userCred = await createUserWithEmailAndPassword(auth, email, password);

      // 3. Save user details in 'users' collection
      await setDoc(doc(db, "users", userCred.user.uid), {
        username,
        email,
        studentName,
        adminToken: token,
        role: "student",
        createdAt: new Date()
      });

      // 4. Mark token as assigned with Gmail info
      await updateDoc(tokenRef, {
        assigned: true,
        assignedTo: email
      });

      // 5. Navigate to main map page
      router.replace("/map");
    } catch (err: any) {
      setError(err.message);
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
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 24 }}
        >
          <View className="w-full px-6">
            {/* Header Section */}
            <View className="items-center mb-4">
              <View className="w-24 h-24 rounded-3xl bg-primary items-center justify-center shadow-lg mb-5">
                <UserPlus className="text-primary-foreground" size={36} />
              </View>
              <Text className="text-4xl font-bold text-foreground mb-2 text-center">Create Account</Text>
              <Text className="text-muted-foreground text-center text-lg px-4 leading-6">
                Join us to start your journey
              </Text>
            </View>

            {/* Main Card */}
            <Card className="w-full shadow-lg" style={{ alignSelf: 'center', width: '100%', maxWidth: 480 }}>
              <CardHeader>
                <CardTitle className="text-2xl text-center text-foreground">Sign Up</CardTitle>
              </CardHeader>

              <CardContent className="space-y-2">
                {error ? (
                  <View className="bg-destructive/10 border border-destructive/20 rounded-lg px-4 py-3 mb-2">
                    <Text className="text-destructive text-sm text-center font-medium">{error}</Text>
                  </View>
                ) : null}

                {/* Username */}
                <View className="space-y-2">
                  <Text className="text-foreground font-medium text-base left-2">Username</Text>
                  <Input
                    placeholder="Choose a username"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                    autoComplete="username"
                    textContentType="username"
                    className="h-12 pl-4 text-base bg-card border-border focus:border-ring"
                  />
                </View>

                {/* Email */}
                <View className="space-y-2">
                  <Text className="text-foreground font-medium text-base left-2">Gmail</Text>
                  <Input
                    placeholder="Enter your Gmail address"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    textContentType="emailAddress"
                    className="h-12 pl-4 text-base bg-card border-border focus:border-ring"
                  />
                </View>

                {/* Student Name */}
                <View className="space-y-2">
                  <Text className="text-foreground font-medium text-base left-2">Student Name</Text>
                  <Input
                    placeholder="Enter your full name"
                    value={studentName}
                    onChangeText={setStudentName}
                    autoComplete="name"
                    textContentType="name"
                    className="h-12 pl-4 text-base bg-card border-border focus:border-ring"
                  />
                </View>

                {/* Password */}
                <View className="space-y-2 mt-2">
                  <Text className="text-foreground font-medium text-base left-2">Password</Text>
                  <View className="relative">
                    <Input
                      placeholder="Create a secure password"
                      secureTextEntry={!showPassword}
                      value={password}
                      onChangeText={setPassword}
                      autoComplete="new-password"
                      textContentType="newPassword"
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

                {/* Admin Token */}
                <View className="space-y-2 mt-2">
                  <Text className="text-foreground font-medium text-base left-2">Admin Token</Text>
                  <View className="relative">
                    <Input
                      placeholder="Enter admin token"
                      secureTextEntry={!showToken}
                      value={token}
                      onChangeText={setToken}
                      autoCapitalize="none"
                      className="h-12 pl-4 pr-10 text-base bg-card border-border focus:border-ring"
                    />
                    <Pressable
                      onPress={() => setShowToken(!showToken)}
                      className="absolute right-4 top-3.5"
                    >
                      {showToken ? (
                        <Key size={20} className="text-muted-foreground" />
                      ) : (
                        <Key size={20} className="text-muted-foreground opacity-60" />
                      )}
                    </Pressable>
                  </View>
                </View>

                {/* Register Button */}
                <Button
                  onPress={handleRegister}
                  disabled={isLoading}
                  className="h-12 mt-3.5"
                  size="lg"
                >
                  <View className="flex-row items-center">
                    <Text className="text-primary-foreground font-semibold text-base mr-2">
                      {isLoading ? "Creating Account..." : "Create Account"}
                    </Text>
                    {!isLoading && <ArrowRight size={16} className="text-primary-foreground" />}
                  </View>
                </Button>
              </CardContent>
            </Card>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
