import { useRouter } from "expo-router";
import { Button } from "react-native";

export default function LoginScreen() {
  const router = useRouter();

  const handleLogin = async () => {
    // Pretend login works
    router.replace("/map"); // goes to tabs layout, defaulting to Map screen
  };

  return <Button title="Login" onPress={handleLogin} />;
}
