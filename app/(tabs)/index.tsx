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
import { LinearGradient } from 'expo-linear-gradient';
import { changeLanguage } from '../../i18n';

export default function HomeScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { currentGame, loadGame } = useGame();
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);

  const backgroundColor = useThemeColor({}, 'background');
  const primaryColor = useThemeColor({}, 'primary');
  const secondaryColor = useThemeColor({}, 'secondary');
  const cardBackground = useThemeColor({}, 'card');
  const borderColor = useThemeColor({}, 'border');
  const textColor = useThemeColor({}, 'text');
  const gradient1 = useThemeColor({}, 'gradient1');
  const gradient2 = useThemeColor({}, 'gradient2');
  const gradient3 = useThemeColor({}, 'gradient3');

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
    <LinearGradient
      colors={[gradient1, gradient2, gradient3]}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Hero Header */}
        <View style={[styles.heroCard, { backgroundColor: cardBackground, borderColor: primaryColor }]}>
          <ThemedText type="title" style={[styles.title, { color: primaryColor }]}>
            🃏 {t('app.name')}
          </ThemedText>
          <View style={[styles.taglineBadge, { backgroundColor: secondaryColor }]}>
            <ThemedText style={styles.tagline}>
              {t('app.tagline')}
            </ThemedText>
          </View>
        </View>

        {/* Language Selector Card */}
        <View style={[styles.card, { backgroundColor: cardBackground, borderColor }]}>
          <View style={[styles.labelBadge, { backgroundColor: '#FFD23F' }]}>
            <ThemedText style={styles.labelBadgeText}>
              🌍 {t('settings.language')}
            </ThemedText>
          </View>
          <View style={[styles.pickerContainer, { backgroundColor: 'rgba(255, 255, 255, 0.1)', borderColor: '#FFD23F' }]}>
            <Picker
              selectedValue={selectedLanguage}
              onValueChange={handleLanguageChange}
              style={[styles.picker, { color: textColor }]}
              dropdownIconColor="#FFD23F"
            >
              <Picker.Item label="🇩🇪 Deutsch" value="de" />
              <Picker.Item label="🇬🇧 English" value="en" />
              <Picker.Item label="🇫🇷 Français" value="fr" />
              <Picker.Item label="🇳🇱 Nederlands" value="nl" />
            </Picker>
          </View>
        </View>

        {/* Game Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleNewGame}
          >
            <LinearGradient
              colors={[primaryColor, secondaryColor]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.primaryButton}
            >
              <ThemedText style={styles.buttonText}>
                🎮 {t('setup.title')}
              </ThemedText>
            </LinearGradient>
          </TouchableOpacity>

          {currentGame && currentGame.isActive && (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleContinueGame}
            >
              <View style={[styles.secondaryButton, { borderColor: secondaryColor }]}>
                <ThemedText style={[styles.buttonText, { color: secondaryColor }]}>
                  ▶️ {t('game.currentGame')}
                </ThemedText>
              </View>
            </TouchableOpacity>
          )}
        </View>

        {/* Info Section */}
        <View style={[styles.infoCard, { backgroundColor: cardBackground, borderColor }]}>
          <View style={styles.infoHeader}>
            <ThemedText style={[styles.infoTitle, { color: primaryColor }]}>
              ℹ️ About Skat Scoreboard
            </ThemedText>
          </View>
          <ThemedText style={[styles.infoText, { color: textColor }]}>
            Track your Skat game scores easily with support for:
          </ThemedText>
          <View style={styles.featureList}>
            <View style={styles.featureItem}>
              <View style={[styles.featureBullet, { backgroundColor: '#00D4FF' }]} />
              <ThemedText style={[styles.featureText, { color: textColor }]}>
                All game types (Grand, Suit, Null)
              </ThemedText>
            </View>
            <View style={styles.featureItem}>
              <View style={[styles.featureBullet, { backgroundColor: '#B24BF3' }]} />
              <ThemedText style={[styles.featureText, { color: textColor }]}>
                Hand, Schneider, Schwarz modifiers
              </ThemedText>
            </View>
            <View style={styles.featureItem}>
              <View style={[styles.featureBullet, { backgroundColor: '#FF006E' }]} />
              <ThemedText style={[styles.featureText, { color: textColor }]}>
                Automatic score calculation
              </ThemedText>
            </View>
            <View style={styles.featureItem}>
              <View style={[styles.featureBullet, { backgroundColor: '#00FF94' }]} />
              <ThemedText style={[styles.featureText, { color: textColor }]}>
                Game history tracking
              </ThemedText>
            </View>
            <View style={styles.featureItem}>
              <View style={[styles.featureBullet, { backgroundColor: '#FFD23F' }]} />
              <ThemedText style={[styles.featureText, { color: textColor }]}>
                Multi-language support
              </ThemedText>
            </View>
          </View>
        </View>

        {/* AdMob Banner */}
        <SkatBannerAd />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  heroCard: {
    borderRadius: 24,
    padding: 30,
    marginBottom: 24,
    borderWidth: 3,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#00D4FF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: 1.5,
  },
  taglineBadge: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  tagline: {
    fontSize: 15,
    textAlign: 'center',
    color: '#FFFFFF',
    fontWeight: '600',
  },
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 2,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  labelBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  labelBadgeText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  pickerContainer: {
    borderWidth: 2,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  picker: {
    height: 54,
  },
  actionsContainer: {
    gap: 16,
    marginBottom: 24,
  },
  primaryButton: {
    height: 64,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#00D4FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
  },
  secondaryButton: {
    height: 60,
    borderRadius: 16,
    borderWidth: 2,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  infoCard: {
    borderRadius: 16,
    borderWidth: 2,
    padding: 20,
    marginBottom: 20,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  infoHeader: {
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  infoText: {
    fontSize: 15,
    marginBottom: 16,
    lineHeight: 22,
    opacity: 0.9,
  },
  featureList: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureBullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  featureText: {
    fontSize: 15,
    lineHeight: 22,
    flex: 1,
  },
});
