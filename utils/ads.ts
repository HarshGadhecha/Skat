import { Platform } from 'react-native';
import {
  InterstitialAd,
  AdEventType,
  TestIds,
} from 'react-native-google-mobile-ads';

// Test ad unit IDs - replace with your actual Ad Unit IDs in production
const interstitialAdUnitId = __DEV__
  ? TestIds.INTERSTITIAL
  : Platform.select({
      ios: 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyy', // Replace with your iOS interstitial ad unit ID
      android: 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyy', // Replace with your Android interstitial ad unit ID
    });

let interstitialAd: InterstitialAd | null = null;
let isAdLoaded = false;

/**
 * Initialize and load an interstitial ad
 */
export function loadInterstitialAd() {
  if (!interstitialAdUnitId) return;

  try {
    interstitialAd = InterstitialAd.createForAdRequest(interstitialAdUnitId, {
      requestNonPersonalizedAdsOnly: false,
    });

    const unsubscribeLoaded = interstitialAd.addAdEventListener(
      AdEventType.LOADED,
      () => {
        isAdLoaded = true;
      }
    );

    const unsubscribeClosed = interstitialAd.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        isAdLoaded = false;
        // Reload a new ad for next time
        loadInterstitialAd();
      }
    );

    interstitialAd.load();

    return () => {
      unsubscribeLoaded();
      unsubscribeClosed();
    };
  } catch (error) {
    console.error('Failed to load interstitial ad:', error);
  }
}

/**
 * Show the interstitial ad if loaded
 * Returns true if ad was shown, false otherwise
 */
export async function showInterstitialAd(): Promise<boolean> {
  if (!interstitialAd || !isAdLoaded) {
    return false;
  }

  try {
    await interstitialAd.show();
    return true;
  } catch (error) {
    console.error('Failed to show interstitial ad:', error);
    return false;
  }
}

/**
 * Initialize ads when app starts
 */
export function initializeAds() {
  loadInterstitialAd();
}
