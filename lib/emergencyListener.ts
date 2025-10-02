import { Alert } from "react-native";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { notifyEmergency } from "@/lib/notifications";

// optional: prevent double alerts if Firestore sends same payload twice
let lastSeenTsByToken: Record<string, number> = {};

export function listenEmergency(adminToken: string, enabled = true) {
  if (!enabled) return () => {};

  const docRef = doc(db, "alerts", adminToken);

  const unsub = onSnapshot(docRef, async (snap) => {
    if (!snap.exists()) return;
    const data: any = snap.data();

    // expect: { state: "pressed", ts: number, ack: boolean }
    if (data?.state === "pressed" && !data?.ack) {
      // debounce by ts (recommended)
      const ts = Number(data.ts) || 0;
      if (lastSeenTsByToken[adminToken] === ts) return;
      lastSeenTsByToken[adminToken] = ts;

      await notifyEmergency("Emergency Alert", `Button pressed on ${adminToken}`);

      Alert.alert(
        "Emergency Alert",
        `Emergency button pressed on ${adminToken}`,
        [
          {
            text: "Acknowledge",
            onPress: async () => {
              await updateDoc(docRef, { ack: true });
            },
          },
          { text: "Close", style: "cancel" },
        ],
        { cancelable: true }
      );
    }
  });

  return () => unsub();
}
