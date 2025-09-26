import React, { useState } from "react";
import { View, TextInput, Button, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function RegisterScreen() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [studentName, setStudentName] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleRegister = async () => {
    if (!username || !email || !password || !token || !studentName) {
      setError("Please fill in all fields");
      return;
    }

    // Mock logic: store token to simulate login after registration
    await AsyncStorage.setItem("auth_token", "mock_token");
    router.replace("/map");
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Register</Text>
      <TextInput placeholder="Username" value={username} onChangeText={setUsername} />
      <TextInput placeholder="Gmail" value={email} onChangeText={setEmail} />
      <TextInput placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
      <TextInput placeholder="Admin Token" value={token} onChangeText={setToken} />
      <TextInput placeholder="Student Name" value={studentName} onChangeText={setStudentName} />
      {error ? <Text style={{ color: "red" }}>{error}</Text> : null}
      <Button title="Register" onPress={handleRegister} />
      <Button title="Go to Log-in" onPress={() => router.push("/auth/login")} />
    </View>
  );
}
