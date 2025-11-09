import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import { SkatBannerAd } from '../../components/ads/BannerAd';
import { ThemedText } from '../../components/themed-text';
import { ThemedView } from '../../components/themed-view';
import { useGame } from '../../context/GameContext';
import { useThemeColor } from '../../hooks/use-theme-color';

export default function ScoreboardScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { currentGame, endGame } = useGame();
  const [showDetails, setShowDetails] = useState(true);

  const backgroundColor = useThemeColor({}, 'background');
  const borderColor = useThemeColor({}, 'border');
  const primaryColor = useThemeColor({}, 'tint');
  const cardBackground = useThemeColor({}, 'card');

  if (!currentGame) {
    return (
      <ThemedView style={[styles.container, { backgroundColor }]}>
        <ThemedText style={styles.noGameText}>
          No active game
        </ThemedText>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: primaryColor }]}
          onPress={() => router.replace('/screens/SetupScreen')}
        >
          <ThemedText style={styles.buttonText}>
            {t('setup.startGame')}
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  const handleEndGame = () => {
    Alert.alert(
      t('game.endGame'),
      t('game.confirmEnd'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.confirm'),
          style: 'destructive',
          onPress: async () => {
            await endGame();
            router.replace('/screens/SetupScreen');
          },
        },
      ]
    );
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      <View style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          {t('game.scoreboard')}
        </ThemedText>
        <ThemedText style={styles.roundCounter}>
          {t('game.round', { number: currentGame.rounds.length })}
        </ThemedText>
      </View>

      {/* Player Scores Table */}
      <View style={[styles.scoreTable, { backgroundColor: cardBackground, borderColor }]}>
        <View style={styles.tableHeader}>
          <ThemedText style={styles.tableHeaderText}>
            Player
          </ThemedText>
          <ThemedText style={styles.tableHeaderText}>
            {t('game.totalScore')}
          </ThemedText>
        </View>
        {currentGame.players.map((player, index) => (
          <View
            key={player.id}
            style={[
              styles.playerRow,
              index < currentGame.players.length - 1 && { borderBottomWidth: 1, borderColor },
            ]}
          >
            <ThemedText style={styles.playerName}>{player.name}</ThemedText>
            <ThemedText
              style={[
                styles.playerScore,
                { color: player.totalScore >= 0 ? '#4CAF50' : '#F44336' },
              ]}
            >
              {player.totalScore > 0 ? '+' : ''}
              {player.totalScore}
            </ThemedText>
          </View>
        ))}
      </View>

      {/* Round History */}
      {showDetails && currentGame.rounds.length > 0 && (
        <ScrollView style={styles.roundHistory}>
          <ThemedText style={styles.sectionTitle}>
            Recent Rounds
          </ThemedText>
          {[...currentGame.rounds].reverse().slice(0, 5).map((round) => {
            const declarer = currentGame.players.find((p) => p.id === round.declarerId);
            return (
              <View
                key={round.id}
                style={[styles.roundCard, { backgroundColor: cardBackground, borderColor }]}
              >
                <View style={styles.roundHeader}>
                  <ThemedText style={styles.roundNumber}>
                    #{round.roundNumber}
                  </ThemedText>
                  <ThemedText style={styles.roundGameType}>
                    {t(`gameTypes.${round.gameType}`)}
                  </ThemedText>
                </View>
                <ThemedText style={styles.roundDeclarer}>
                  {declarer?.name} - {round.won ? t('round.won') : t('round.lost')}
                </ThemedText>
                <ThemedText
                  style={[
                    styles.roundScore,
                    { color: round.won ? '#4CAF50' : '#F44336' },
                  ]}
                >
                  {round.calculatedScore > 0 ? '+' : ''}
                  {round.calculatedScore}
                </ThemedText>
              </View>
            );
          })}
        </ScrollView>
      )}

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.button, styles.primaryButton, { backgroundColor: primaryColor }]}
          onPress={() => router.push('/screens/AddRoundScreen')}
        >
          <ThemedText style={styles.buttonText}>
            {t('game.newRound')}
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton, { borderColor: primaryColor }]}
          onPress={handleEndGame}
        >
          <ThemedText style={[styles.buttonText, { color: primaryColor }]}>
            {t('game.endGame')}
          </ThemedText>
        </TouchableOpacity>
      </View>

      {/* AdMob Banner */}
      <SkatBannerAd />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  header: {
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  roundCounter: {
    fontSize: 16,
    marginTop: 5,
    opacity: 0.7,
  },
  scoreTable: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 2,
    borderColor: '#ddd',
  },
  tableHeaderText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  playerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
  },
  playerName: {
    fontSize: 18,
    fontWeight: '600',
  },
  playerScore: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  roundHistory: {
    flex: 1,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  roundCard: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 12,
    marginBottom: 10,
  },
  roundHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  roundNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    opacity: 0.7,
  },
  roundGameType: {
    fontSize: 14,
    fontWeight: '600',
  },
  roundDeclarer: {
    fontSize: 14,
    marginBottom: 5,
  },
  roundScore: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  actions: {
    gap: 10,
  },
  button: {
    height: 50,
    borderRadius: 10,
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
    fontSize: 16,
    fontWeight: 'bold',
  },
  noGameText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 100,
    marginBottom: 40,
  },
});
