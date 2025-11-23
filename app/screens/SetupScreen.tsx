import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemedText } from '../../components/themed-text';
import { ThemedView } from '../../components/themed-view';
import { useGame } from '../../context/GameContext';
import { useThemeColor } from '../../hooks/use-theme-color';

export default function SetupScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { startNewGame } = useGame();
  const [playerNames, setPlayerNames] = useState(['', '', '']);

  const backgroundColor = useThemeColor({}, 'background');
  const borderColor = useThemeColor({}, 'border');
  const inputBackground = useThemeColor({}, 'inputBackground');
  const primaryColor = useThemeColor({}, 'primary');
  const secondaryColor = useThemeColor({}, 'secondary');
  const cardColor = useThemeColor({}, 'card');
  const textColor = useThemeColor({}, 'text');
  const gradient1 = useThemeColor({}, 'gradient1');
  const gradient2 = useThemeColor({}, 'gradient2');
  const gradient3 = useThemeColor({}, 'gradient3');

  const updatePlayerName = (index: number, name: string) => {
    const newNames = [...playerNames];
    newNames[index] = name;
    setPlayerNames(newNames);
  };

  const handleStartGame = () => {
    const validNames = playerNames.filter((name) => name.trim() !== '');

    if (validNames.length < 3) {
      Alert.alert(
        t('common.error'),
        t('setup.minPlayers'),
        [{ text: t('common.confirm') }]
      );
      return;
    }

    startNewGame(validNames);
    router.replace('/screens/ScoreboardScreen');
  };

  return (
    <LinearGradient
      colors={[gradient1, gradient2, gradient3]}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Decorative header card */}
          <View style={[styles.headerCard, { backgroundColor: cardColor, borderColor }]}>
            <ThemedText type="title" style={[styles.title, { color: primaryColor }]}>
              🎮 {t('setup.title')}
            </ThemedText>
            <ThemedText style={[styles.subtitle, { color: textColor }]}>
              {t('setup.playerNames')}
            </ThemedText>
          </View>

          {/* Player input cards */}
          <View style={styles.playersContainer}>
            {playerNames.map((name, index) => {
              const playerColors = [primaryColor, secondaryColor, '#FF006E'];
              const accentColor = playerColors[index % playerColors.length];

              return (
                <View
                  key={index}
                  style={[
                    styles.playerCard,
                    {
                      backgroundColor: cardColor,
                      borderColor: accentColor,
                      shadowColor: accentColor,
                    }
                  ]}
                >
                  <View style={[styles.playerBadge, { backgroundColor: accentColor }]}>
                    <ThemedText style={styles.playerBadgeText}>
                      P{index + 1}
                    </ThemedText>
                  </View>
                  <TextInput
                    style={[
                      styles.input,
                      {
                        backgroundColor: inputBackground,
                        borderColor: accentColor,
                        color: textColor,
                      },
                    ]}
                    value={name}
                    onChangeText={(text) => updatePlayerName(index, text)}
                    placeholder={t('setup.enterName')}
                    placeholderTextColor="rgba(255, 255, 255, 0.4)"
                    autoCapitalize="words"
                    returnKeyType={index < 2 ? 'next' : 'done'}
                  />
                </View>
              );
            })}
          </View>

          {/* Start game button with gradient */}
          <TouchableOpacity
            onPress={handleStartGame}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[primaryColor, secondaryColor]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.startButton}
            >
              <ThemedText style={styles.startButtonText}>
                ▶️ {t('setup.startGame')}
              </ThemedText>
            </LinearGradient>
          </TouchableOpacity>

          {/* Add some bottom spacing */}
          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 60,
  },
  headerCard: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 30,
    borderWidth: 2,
    elevation: 8,
    shadowColor: '#00D4FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.9,
  },
  playersContainer: {
    gap: 16,
  },
  playerCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    elevation: 6,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  playerBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  playerBadgeText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  input: {
    flex: 1,
    height: 48,
    borderWidth: 2,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 17,
    fontWeight: '600',
  },
  startButton: {
    height: 64,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    elevation: 8,
    shadowColor: '#00D4FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});
