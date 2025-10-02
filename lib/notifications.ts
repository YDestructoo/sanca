import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

/** Call once on app start (or before you start listening). */
export async function setupNotifications() {
  // Android: channel must use a STRING for `sound`, not boolean
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("emergency", {
      name: "Emergency Alerts",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      sound: "default",               // ✅ string, fixes your TS error
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
      bypassDnd: true,
    });
  }

  // Ask permission
  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
}

/** Show a local notification immediately. */
export async function notifyEmergency(title: string, body: string) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: true,
    },
    trigger: null,
  });
}
