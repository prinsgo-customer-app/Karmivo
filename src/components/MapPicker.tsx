import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import * as Location from 'expo-location';
import { Typography } from './Typography';
import { colors, radius, spacing } from '../theme/colors';
import { MapPin } from 'lucide-react-native';

interface MapPickerProps {
  onLocationSelected: (address: string, lat: number, lng: number) => void;
}

export const MapPicker = ({ onLocationSelected }: MapPickerProps) => {
  const [initialRegion, setInitialRegion] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const webViewRef = useRef<WebView>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        // Fallback to default location (e.g., Delhi, India)
        setInitialRegion({ lat: 28.6139, lng: 77.2090 });
        setLoading(false);
        return;
      }

      try {
        let location = await Location.getCurrentPositionAsync({});
        setInitialRegion({ lat: location.coords.latitude, lng: location.coords.longitude });
      } catch (e) {
        setInitialRegion({ lat: 28.6139, lng: 77.2090 });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleMessage = async (event: any) => {
    try {
      const { lat, lng } = JSON.parse(event.nativeEvent.data);
      let geocode = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lng });
      if (geocode && geocode.length > 0) {
        const address = geocode[0];
        const formattedAddress = `${address.name ? address.name + ', ' : ''}${address.street || ''} ${address.city || address.district || ''} ${address.region || ''} ${address.postalCode || ''}`.trim();
        onLocationSelected(formattedAddress || 'Unknown Location', lat, lng);
      } else {
        onLocationSelected(`${lat.toFixed(4)}, ${lng.toFixed(4)}`, lat, lng);
      }
    } catch (e) {
      console.warn('Failed to parse map selection', e);
    }
  };

  if (loading || !initialRegion) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Typography variant="caption" style={{ marginTop: spacing.sm }}>Loading Map...</Typography>
      </View>
    );
  }

  const mapHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <style>
          body { padding: 0; margin: 0; }
          #map { height: 100vh; width: 100vw; }
          .center-marker {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -100%);
            z-index: 1000;
            pointer-events: none;
            width: 32px;
            height: 32px;
          }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <img class="center-marker" src="https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png" />
        <script>
          const map = L.map('map', { zoomControl: false }).setView([${initialRegion.lat}, ${initialRegion.lng}], 15);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
          }).addTo(map);

          map.on('moveend', function() {
            const center = map.getCenter();
            window.ReactNativeWebView.postMessage(JSON.stringify({ lat: center.lat, lng: center.lng }));
          });

          // Send initial location
          window.ReactNativeWebView.postMessage(JSON.stringify({ lat: ${initialRegion.lat}, lng: ${initialRegion.lng} }));
        </script>
      </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{ html: mapHtml }}
        onMessage={handleMessage}
        scrollEnabled={false}
        style={styles.map}
      />
      <View style={styles.overlayText}>
        <Typography variant="caption" style={styles.helperText}>Drag map to adjust location</Typography>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 250,
    width: '100%',
    borderRadius: radius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    position: 'relative',
  },
  loaderContainer: {
    height: 250,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  overlayText: {
    position: 'absolute',
    bottom: spacing.sm,
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.round,
  },
  helperText: {
    color: colors.text.primary,
    fontWeight: 'bold',
  }
});
