import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SkatBannerAd } from '../../components/ads/BannerAd';
import { ThemedText } from '../../components/themed-text';
import { ThemedView } from '../../components/themed-view';
import { useGame } from '../../context/GameContext';
import { useThemeColor } from '../../hooks/use-theme-color';
import { GameType, RoundModifiers } from '../../types/game';
import { getMinimumBid } from '../../utils/scoring';

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
  const primaryColor = useThemeColor({}, 'primary');
  const secondaryColor = useThemeColor({}, 'secondary');
  const cardBackground = useThemeColor({}, 'card');
  const textColor = useThemeColor({}, 'text');
  const successColor = useThemeColor({}, 'success');
  const errorColor = useThemeColor({}, 'error');
  const gradient1 = useThemeColor({}, 'gradient1');
  const gradient2 = useThemeColor({}, 'gradient2');
  const gradient3 = useThemeColor({}, 'gradient3');

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
    <LinearGradient
      colors={[gradient1, gradient2, gradient3]}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header Card */}
        <View style={[styles.headerCard, { backgroundColor: cardBackground, borderColor: primaryColor }]}>
          <ThemedText type="title" style={[styles.title, { color: primaryColor }]}>
            🎯 {t('round.title')}
          </ThemedText>
        </View>

        {/* Declarer Selection */}
        <View style={[styles.card, { backgroundColor: cardBackground, borderColor }]}>
          <View style={[styles.labelBadge, { backgroundColor: primaryColor }]}>
            <ThemedText style={styles.labelBadgeText}>👤 {t('round.declarer')}</ThemedText>
          </View>
          <View style={[styles.pickerContainer, { borderColor: primaryColor, backgroundColor: inputBackground }]}>
            <Picker
              selectedValue={declarerId}
              onValueChange={setDeclarerId}
              style={[styles.picker, { color: textColor }]}
              dropdownIconColor={primaryColor}
            >
              <Picker.Item label={t('round.selectDeclarer')} value="" />
              {currentGame.players.map((player) => (
                <Picker.Item key={player.id} label={player.name} value={player.id} />
              ))}
            </Picker>
          </View>
        </View>

        {/* Game Type Selection */}
        <View style={[styles.card, { backgroundColor: cardBackground, borderColor }]}>
          <View style={[styles.labelBadge, { backgroundColor: secondaryColor }]}>
            <ThemedText style={styles.labelBadgeText}>🃏 {t('round.gameType')}</ThemedText>
          </View>
          <View style={[styles.pickerContainer, { borderColor: secondaryColor, backgroundColor: inputBackground }]}>
            <Picker
              selectedValue={gameType}
              onValueChange={(value) => setGameType(value as GameType)}
              style={[styles.picker, { color: textColor }]}
              dropdownIconColor={secondaryColor}
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
        <View style={[styles.card, { backgroundColor: cardBackground, borderColor }]}>
          <View style={[styles.labelBadge, { backgroundColor: '#FFD23F' }]}>
            <ThemedText style={styles.labelBadgeText}>💰 {t('round.bidValue')}</ThemedText>
          </View>
          <TextInput
            style={[styles.input, { backgroundColor: inputBackground, borderColor: '#FFD23F', color: textColor }]}
            value={bidValue}
            onChangeText={setBidValue}
            placeholder={`${getMinimumBid(gameType)}`}
            keyboardType="number-pad"
            placeholderTextColor="rgba(255, 255, 255, 0.4)"
          />
        </View>

        {/* Modifiers */}
        {!gameType.startsWith('null') && (
          <View style={[styles.card, { backgroundColor: cardBackground, borderColor }]}>
            <View style={[styles.labelBadge, { backgroundColor: '#FF6B35' }]}>
              <ThemedText style={styles.labelBadgeText}>⚡ Modifiers</ThemedText>
            </View>
            <View style={styles.modifierGrid}>
              {Object.keys(modifiers).map((key) => {
                const isActive = modifiers[key as keyof RoundModifiers];
                return (
                  <TouchableOpacity
                    key={key}
                    activeOpacity={0.7}
                    onPress={() => toggleModifier(key as keyof RoundModifiers)}
                  >
                    <LinearGradient
                      colors={isActive
                        ? [primaryColor, secondaryColor]
                        : ['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
                      style={[
                        styles.modifierButton,
                        { borderColor: isActive ? primaryColor : borderColor }
                      ]}
                    >
                      <ThemedText
                        style={[
                          styles.modifierText,
                          { color: isActive ? '#FFFFFF' : textColor },
                        ]}
                      >
                        {isActive ? '✓ ' : ''}
                        {t(`round.${key}`)}
                      </ThemedText>
                    </LinearGradient>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* Result */}
        <View style={[styles.card, { backgroundColor: cardBackground, borderColor }]}>
          <View style={[styles.labelBadge, { backgroundColor: '#B24BF3' }]}>
            <ThemedText style={styles.labelBadgeText}>🎲 {t('round.result')}</ThemedText>
          </View>
          <View style={styles.resultButtons}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setWon(true)}
            >
              <LinearGradient
                colors={won ? [successColor, '#00CC7A'] : ['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
                style={[
                  styles.resultButton,
                  { borderColor: won ? successColor : borderColor }
                ]}
              >
                <ThemedText style={[styles.resultText, { color: won ? '#FFFFFF' : textColor }]}>
                  {won ? '✅ ' : ''}
                  {t('round.won')}
                </ThemedText>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setWon(false)}
            >
              <LinearGradient
                colors={!won ? [errorColor, '#CC0055'] : ['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
                style={[
                  styles.resultButton,
                  { borderColor: !won ? errorColor : borderColor }
                ]}
              >
                <ThemedText style={[styles.resultText, { color: !won ? '#FFFFFF' : textColor }]}>
                  {!won ? '❌ ' : ''}
                  {t('round.lost')}
                </ThemedText>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* Actual Points (Optional) */}
        <View style={[styles.card, { backgroundColor: cardBackground, borderColor }]}>
          <View style={[styles.labelBadge, { backgroundColor: '#00FF94' }]}>
            <ThemedText style={styles.labelBadgeText}>📊 {t('round.actualPoints')} (Optional)</ThemedText>
          </View>
          <TextInput
            style={[styles.input, { backgroundColor: inputBackground, borderColor: '#00FF94', color: textColor }]}
            value={actualPoints}
            onChangeText={setActualPoints}
            placeholder="0-120"
            keyboardType="number-pad"
            placeholderTextColor="rgba(255, 255, 255, 0.4)"
          />
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleAddRound}
            style={{ flex: 1 }}
          >
            <LinearGradient
              colors={[primaryColor, secondaryColor]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.submitButton}
            >
              <ThemedText style={styles.submitButtonText}>
                ✅ {t('round.addRound')}
              </ThemedText>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.cancelButton, { borderColor: errorColor }]}
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <ThemedText style={[styles.cancelButtonText, { color: errorColor }]}>
              ❌ {t('common.cancel')}
            </ThemedText>
          </TouchableOpacity>
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
  headerCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 2,
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#00D4FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
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
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
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
    fontSize: 16,
  },
  input: {
    height: 54,
    borderWidth: 2,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 17,
    fontWeight: '600',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  modifierGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  modifierButton: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 12,
    borderWidth: 2,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  modifierText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  resultButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  resultButton: {
    flex: 1,
    height: 60,
    borderRadius: 14,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  resultText: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  actionButtons: {
    gap: 12,
    marginTop: 10,
  },
  submitButton: {
    height: 60,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#00D4FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  cancelButton: {
    height: 54,
    borderRadius: 14,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  cancelButtonText: {
    fontSize: 17,
    fontWeight: 'bold',
  },
});
