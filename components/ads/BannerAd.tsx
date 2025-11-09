import React from 'react';
import { Platform, View, StyleSheet } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

// Test ad unit IDs - replace with your actual Ad Unit IDs in production
const adUnitId = __DEV__
  ? TestIds.ADAPTIVE_BANNER
  : Platform.select({
      ios: 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyy', // Replace with your iOS banner ad unit ID
      android: 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyy', // Replace with your Android banner ad unit ID
    });

export function SkatBannerAd() {
  return (
    <View style={styles.container}>
      <BannerAd
        unitId={adUnitId!}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: false,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 10,
  },
});
