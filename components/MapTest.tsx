import React from 'react';
import { View, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

/**
 * Simple test component to verify react-native-maps is working
 */
export default function MapTest() {
  return (
    <View style={{ flex: 1 }}>
      <Text style={{ padding: 20, fontSize: 18, fontWeight: 'bold' }}>
        React Native Maps Test
      </Text>
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: 14.5995,
          longitude: 120.9842,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        <Marker
          coordinate={{
            latitude: 14.5995,
            longitude: 120.9842,
          }}
          title="Test Location"
          description="React Native Maps is working!"
        />
      </MapView>
    </View>
  );
}
