import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import { useGame } from '../../context/GameContext';
import { useThemeColor } from '../../hooks/useThemeColor';
import { GameType, RoundModifiers } from '../../types/game';
import { getMinimumBid } from '../../utils/scoring';
import { SkatBannerAd } from '../../components/ads/BannerAd';

export default function AddRoundScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { currentGame, addRound } = useGame();

  const [declarerId, setDeclarerId] = useState('');
  const [gameType, setGameType] = useState<GameType>('grand');
  const [bidValue, setBidValue] = useState('');
  const [won, setWon] = useState(true);
  const [actualPoints, setActualPoints] = useState('');
  const [modifiers, setModifiers] = useState<RoundModifiers>({
    hand: false,
    schneider: false,
    schneiderAnnounced: false,
    schwarz: false,
    schwarzAnnounced: false,
    ouvert: false,
  });

  const backgroundColor = useThemeColor({}, 'background');
  const borderColor = useThemeColor({}, 'border');
  const inputBackground = useThemeColor({}, 'inputBackground');
  const primaryColor = useThemeColor({}, 'tint');
  const cardBackground = useThemeColor({}, 'card');

  if (!currentGame) {
    return (
      <ThemedView style={[styles.container, { backgroundColor }]}>
        <ThemedText>No active game</ThemedText>
      </ThemedView>
    );
  }

  const gameTypes: GameType[] = [
    'grand',
    'clubs',
    'spades',
    'hearts',
    'diamonds',
    'null',
    'nullHand',
    'nullOuvert',
    'nullOuvertHand',
  ];

  const handleAddRound = () => {
    if (!declarerId) {
      Alert.alert(t('common.error'), t('round.selectDeclarer'));
      return;
    }

    const bid = parseInt(bidValue) || getMinimumBid(gameType);
    const points = parseInt(actualPoints) || 0;

    addRound(declarerId, gameType, bid, modifiers, won, points);
    router.back();
  };

  const toggleModifier = (key: keyof RoundModifiers) => {
    setModifiers((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ThemedText type="title" style={styles.title}>
          {t('round.title')}
        </ThemedText>

        {/* Declarer Selection */}
        <View style={styles.section}>
          <ThemedText style={styles.label}>{t('round.declarer')}</ThemedText>
          <View style={[styles.pickerContainer, { borderColor, backgroundColor: cardBackground }]}>
            <Picker
              selectedValue={declarerId}
              onValueChange={setDeclarerId}
              style={styles.picker}
            >
              <Picker.Item label={t('round.selectDeclarer')} value="" />
              {currentGame.players.map((player) => (
                <Picker.Item key={player.id} label={player.name} value={player.id} />
              ))}
            </Picker>
          </View>
        </View>

        {/* Game Type Selection */}
        <View style={styles.section}>
          <ThemedText style={styles.label}>{t('round.gameType')}</ThemedText>
          <View style={[styles.pickerContainer, { borderColor, backgroundColor: cardBackground }]}>
            <Picker
              selectedValue={gameType}
              onValueChange={(value) => setGameType(value as GameType)}
              style={styles.picker}
            >
              {gameTypes.map((type) => (
                <Picker.Item
                  key={type}
                  label={t(`gameTypes.${type}`)}
                  value={type}
                />
              ))}
            </Picker>
          </View>
        </View>

        {/* Bid Value */}
        <View style={styles.section}>
          <ThemedText style={styles.label}>{t('round.bidValue')}</ThemedText>
          <TextInput
            style={[styles.input, { backgroundColor: inputBackground, borderColor }]}
            value={bidValue}
            onChangeText={setBidValue}
            placeholder={`${getMinimumBid(gameType)}`}
            keyboardType="number-pad"
            placeholderTextColor="#999"
          />
        </View>

        {/* Modifiers */}
        {!gameType.startsWith('null') && (
          <View style={styles.section}>
            <ThemedText style={styles.label}>Modifiers</ThemedText>
            <View style={styles.modifierGrid}>
              {Object.keys(modifiers).map((key) => (
                <TouchableOpacity
                  key={key}
                  style={[
                    styles.modifierButton,
                    {
                      backgroundColor: modifiers[key as keyof RoundModifiers]
                        ? primaryColor
                        : cardBackground,
                      borderColor,
                    },
                  ]}
                  onPress={() => toggleModifier(key as keyof RoundModifiers)}
                >
                  <ThemedText
                    style={[
                      styles.modifierText,
                      { color: modifiers[key as keyof RoundModifiers] ? '#fff' : primaryColor },
                    ]}
                  >
                    {t(`round.${key}`)}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Result */}
        <View style={styles.section}>
          <ThemedText style={styles.label}>{t('round.result')}</ThemedText>
          <View style={styles.resultButtons}>
            <TouchableOpacity
              style={[
                styles.resultButton,
                {
                  backgroundColor: won ? '#4CAF50' : cardBackground,
                  borderColor: won ? '#4CAF50' : borderColor,
                },
              ]}
              onPress={() => setWon(true)}
            >
              <ThemedText style={[styles.resultText, { color: won ? '#fff' : primaryColor }]}>
                {t('round.won')}
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.resultButton,
                {
                  backgroundColor: !won ? '#F44336' : cardBackground,
                  borderColor: !won ? '#F44336' : borderColor,
                },
              ]}
              onPress={() => setWon(false)}
            >
              <ThemedText style={[styles.resultText, { color: !won ? '#fff' : primaryColor }]}>
                {t('round.lost')}
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>

        {/* Actual Points (Optional) */}
        <View style={styles.section}>
          <ThemedText style={styles.label}>
            {t('round.actualPoints')} (Optional)
          </ThemedText>
          <TextInput
            style={[styles.input, { backgroundColor: inputBackground, borderColor }]}
            value={actualPoints}
            onChangeText={setActualPoints}
            placeholder="0-120"
            keyboardType="number-pad"
            placeholderTextColor="#999"
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, { backgroundColor: primaryColor }]}
          onPress={handleAddRound}
        >
          <ThemedText style={styles.submitButtonText}>
            {t('round.addRound')}
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.cancelButton, { borderColor: primaryColor }]}
          onPress={() => router.back()}
        >
          <ThemedText style={[styles.cancelButtonText, { color: primaryColor }]}>
            {t('common.cancel')}
          </ThemedText>
        </TouchableOpacity>

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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  section: {
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 10,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  modifierGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  modifierButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    borderWidth: 1,
  },
  modifierText: {
    fontSize: 14,
    fontWeight: '600',
  },
  resultButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  resultButton: {
    flex: 1,
    height: 50,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  submitButton: {
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cancelButton: {
    height: 50,
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: 'transparent',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
