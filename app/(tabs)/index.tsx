import { SkatBannerAd } from '@/components/ads/BannerAd';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useGame } from '@/context/GameContext';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { changeLanguage } from '../../i18n';

export default function HomeScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { currentGame, loadGame } = useGame();
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);

  const backgroundColor = useThemeColor({}, 'background');
  const primaryColor = useThemeColor({}, 'tint');
  const cardBackground = useThemeColor({}, 'card');
  const borderColor = useThemeColor({}, 'border');

  useEffect(() => {
    loadGame();
  }, []);

  const handleLanguageChange = async (language: string) => {
    setSelectedLanguage(language);
    await changeLanguage(language);
  };

  const handleNewGame = () => {
    router.push('/screens/SetupScreen');
  };

  const handleContinueGame = () => {
    router.push('/screens/ScoreboardScreen');
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            {t('app.name')}
          </ThemedText>
          <ThemedText style={styles.tagline}>
            {t('app.tagline')}
          </ThemedText>
        </View>

        {/* Language Selector */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>
            {t('settings.language')}
          </ThemedText>
          <View style={[styles.pickerContainer, { backgroundColor: cardBackground, borderColor }]}>
            <Picker
              selectedValue={selectedLanguage}
              onValueChange={handleLanguageChange}
              style={styles.picker}
            >
              <Picker.Item label="Deutsch" value="de" />
              <Picker.Item label="English" value="en" />
              <Picker.Item label="Français" value="fr" />
              <Picker.Item label="Nederlands" value="nl" />
            </Picker>
          </View>
        </View>

        {/* Game Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton, { backgroundColor: primaryColor }]}
            onPress={handleNewGame}
          >
            <ThemedText style={styles.buttonText}>
              {t('setup.title')}
            </ThemedText>
          </TouchableOpacity>

          {currentGame && currentGame.isActive && (
            <TouchableOpacity
              style={[styles.button, styles.secondaryButton, { borderColor: primaryColor }]}
              onPress={handleContinueGame}
            >
              <ThemedText style={[styles.buttonText, { color: primaryColor }]}>
                {t('game.currentGame')}
              </ThemedText>
            </TouchableOpacity>
          )}
        </View>

        {/* Info Section */}
        <View style={[styles.infoCard, { backgroundColor: cardBackground, borderColor }]}>
          <ThemedText style={styles.infoTitle}>
            About Skat Scoreboard
          </ThemedText>
          <ThemedText style={styles.infoText}>
            Track your Skat game scores easily with support for:
          </ThemedText>
          <View style={styles.featureList}>
            <ThemedText style={styles.featureItem}>• All game types (Grand, Suit, Null)</ThemedText>
            <ThemedText style={styles.featureItem}>• Hand, Schneider, Schwarz modifiers</ThemedText>
            <ThemedText style={styles.featureItem}>• Automatic score calculation</ThemedText>
            <ThemedText style={styles.featureItem}>• Game history tracking</ThemedText>
            <ThemedText style={styles.featureItem}>• Multi-language support</ThemedText>
          </View>
        </View>

        {/* AdMob Banner */}
        <SkatBannerAd />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  tagline: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.8,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  actionsContainer: {
    gap: 15,
    marginBottom: 30,
  },
  button: {
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButton: {
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  secondaryButton: {
    borderWidth: 2,
    backgroundColor: 'transparent',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 20,
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 15,
    marginBottom: 15,
    lineHeight: 22,
  },
  featureList: {
    gap: 8,
  },
  featureItem: {
    fontSize: 14,
    lineHeight: 20,
  },
});
