import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import { useGame } from '../../context/GameContext';
import { useThemeColor } from '../../hooks/useThemeColor';

export default function SetupScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { startNewGame } = useGame();
  const [playerNames, setPlayerNames] = useState(['', '', '']);

  const backgroundColor = useThemeColor({}, 'background');
  const borderColor = useThemeColor({}, 'border');
  const inputBackground = useThemeColor({}, 'inputBackground');
  const primaryColor = useThemeColor({}, 'tint');

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
    <ThemedView style={[styles.container, { backgroundColor }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <ThemedText type="title" style={styles.title}>
            {t('setup.title')}
          </ThemedText>

          <ThemedText style={styles.subtitle}>
            {t('setup.playerNames')}
          </ThemedText>

          {playerNames.map((name, index) => (
            <View key={index} style={styles.inputContainer}>
              <ThemedText style={styles.inputLabel}>
                {t('setup.player', { number: index + 1 })}
              </ThemedText>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: inputBackground,
                    borderColor,
                    color: primaryColor,
                  },
                ]}
                value={name}
                onChangeText={(text) => updatePlayerName(index, text)}
                placeholder={t('setup.enterName')}
                placeholderTextColor="#999"
                autoCapitalize="words"
                returnKeyType={index < 2 ? 'next' : 'done'}
              />
            </View>
          ))}

          <TouchableOpacity
            style={[styles.startButton, { backgroundColor: primaryColor }]}
            onPress={handleStartGame}
          >
            <ThemedText style={styles.startButtonText}>
              {t('setup.startGame')}
            </ThemedText>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
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
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 30,
    textAlign: 'center',
    opacity: 0.8,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  startButton: {
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
