import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './firebase';

/**
 * Example App component that demonstrates proper Firebase Auth persistence
 * This listens to auth state changes and shows user login status
 */
export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Text style={{ fontSize: 18, marginBottom: 20 }}>
        Firebase Auth Status
      </Text>
      {user ? (
        <View>
          <Text style={{ fontSize: 16, color: 'green' }}>
            ✅ User is logged in
          </Text>
          <Text style={{ fontSize: 14, marginTop: 10 }}>
            Email: {user.email}
          </Text>
          <Text style={{ fontSize: 14 }}>
            UID: {user.uid}
          </Text>
        </View>
      ) : (
        <Text style={{ fontSize: 16, color: 'red' }}>
          ❌ User is not logged in
        </Text>
      )}
    </View>
  );
}
