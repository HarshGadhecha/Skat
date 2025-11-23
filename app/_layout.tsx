import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import mobileAds from 'react-native-google-mobile-ads';
import 'react-native-reanimated';
import { Provider } from 'react-redux';
import '../i18n';

import { GameProvider } from '@/context/GameContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { store } from '@/src/store';
import { initializeAds } from '@/utils/ads';

export const unstable_settings = {
  anchor: 'screens/SetupScreen',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    // Initialize Google Mobile Ads
    mobileAds()
      .initialize()
      .then(() => {
        console.log('AdMob initialized');
        initializeAds();
      })
      .catch((error) => {
        console.error('Failed to initialize AdMob:', error);
      });
  }, []);

  return (
    <Provider store={store}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <GameProvider>
          <Stack>
            <Stack.Screen name="screens/SetupScreen" options={{ headerShown: false }} />
            <Stack.Screen name="screens/ScoreboardScreen" options={{ headerShown: false }} />
            <Stack.Screen name="screens/AddRoundScreen" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
          </Stack>
          <StatusBar style="auto" />
        </GameProvider>
      </ThemeProvider>
    </Provider>
  );
}
