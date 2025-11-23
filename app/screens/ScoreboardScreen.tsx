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
import { LinearGradient } from 'expo-linear-gradient';
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
  const primaryColor = useThemeColor({}, 'primary');
  const secondaryColor = useThemeColor({}, 'secondary');
  const cardBackground = useThemeColor({}, 'card');
  const textColor = useThemeColor({}, 'text');
  const successColor = useThemeColor({}, 'success');
  const errorColor = useThemeColor({}, 'error');
  const gradient1 = useThemeColor({}, 'gradient1');
  const gradient2 = useThemeColor({}, 'gradient2');
  const gradient3 = useThemeColor({}, 'gradient3');
  const rank1 = useThemeColor({}, 'rank1');
  const rank2 = useThemeColor({}, 'rank2');
  const rank3 = useThemeColor({}, 'rank3');

  if (!currentGame) {
    return (
      <LinearGradient
        colors={[gradient1, gradient2, gradient3]}
        style={styles.container}
      >
        <View style={styles.noGameContainer}>
          <ThemedText style={[styles.noGameText, { color: textColor }]}>
            🎮 No active game
          </ThemedText>
          <TouchableOpacity
            onPress={() => router.replace('/screens/SetupScreen')}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[primaryColor, secondaryColor]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.button}
            >
              <ThemedText style={styles.buttonText}>
                {t('setup.startGame')}
              </ThemedText>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }

  // Sort players by score for ranking
  const sortedPlayers = [...currentGame.players].sort((a, b) => b.totalScore - a.totalScore);

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
    <LinearGradient
      colors={[gradient1, gradient2, gradient3]}
      style={styles.container}
    >
      {/* Header Card */}
      <View style={[styles.headerCard, { backgroundColor: cardBackground, borderColor: primaryColor }]}>
        <ThemedText type="title" style={[styles.title, { color: primaryColor }]}>
          🏆 {t('game.scoreboard')}
        </ThemedText>
        <View style={[styles.roundBadge, { backgroundColor: secondaryColor }]}>
          <ThemedText style={styles.roundBadgeText}>
            {t('game.round', { number: currentGame.rounds.length })}
          </ThemedText>
        </View>
      </View>

      {/* Player Leaderboard with Ranks */}
      <View style={styles.leaderboard}>
        {sortedPlayers.map((player, index) => {
          const rankColors = [rank1, rank2, rank3];
          const rankColor = rankColors[index] || primaryColor;
          const rankEmoji = ['🥇', '🥈', '🥉'][index] || '🎯';

          return (
            <View
              key={player.id}
              style={[
                styles.playerCard,
                {
                  backgroundColor: cardBackground,
                  borderColor: rankColor,
                  shadowColor: rankColor,
                }
              ]}
            >
              <View style={[styles.rankBadge, { backgroundColor: rankColor }]}>
                <ThemedText style={styles.rankEmoji}>{rankEmoji}</ThemedText>
              </View>
              <View style={styles.playerInfo}>
                <ThemedText style={[styles.playerName, { color: textColor }]}>
                  {player.name}
                </ThemedText>
                <ThemedText style={styles.playerRank}>
                  Rank #{index + 1}
                </ThemedText>
              </View>
              <LinearGradient
                colors={player.totalScore >= 0
                  ? [successColor, '#00CC7A']
                  : [errorColor, '#CC0055']}
                style={styles.scoreChip}
              >
                <ThemedText style={styles.playerScore}>
                  {player.totalScore > 0 ? '+' : ''}
                  {player.totalScore}
                </ThemedText>
              </LinearGradient>
            </View>
          );
        })}
      </View>

      {/* Round History */}
      {showDetails && currentGame.rounds.length > 0 && (
        <ScrollView style={styles.roundHistory}>
          <View style={[styles.sectionHeader, { backgroundColor: cardBackground, borderColor }]}>
            <ThemedText style={[styles.sectionTitle, { color: primaryColor }]}>
              📜 Recent Rounds
            </ThemedText>
          </View>
          {[...currentGame.rounds].reverse().slice(0, 5).map((round) => {
            const declarer = currentGame.players.find((p) => p.id === round.declarerId);
            const isWin = round.won;
            return (
              <View
                key={round.id}
                style={[
                  styles.roundCard,
                  {
                    backgroundColor: cardBackground,
                    borderColor: isWin ? successColor : errorColor,
                    shadowColor: isWin ? successColor : errorColor,
                  }
                ]}
              >
                <View style={styles.roundHeader}>
                  <View style={[styles.roundNumberBadge, { backgroundColor: isWin ? successColor : errorColor }]}>
                    <ThemedText style={styles.roundNumber}>
                      #{round.roundNumber}
                    </ThemedText>
                  </View>
                  <ThemedText style={[styles.roundGameType, { color: textColor }]}>
                    {t(`gameTypes.${round.gameType}`)}
                  </ThemedText>
                  <LinearGradient
                    colors={isWin ? [successColor, '#00CC7A'] : [errorColor, '#CC0055']}
                    style={styles.roundScoreChip}
                  >
                    <ThemedText style={styles.roundScore}>
                      {round.calculatedScore > 0 ? '+' : ''}
                      {round.calculatedScore}
                    </ThemedText>
                  </LinearGradient>
                </View>
                <ThemedText style={[styles.roundDeclarer, { color: textColor }]}>
                  {declarer?.name} • {isWin ? '✅ ' + t('round.won') : '❌ ' + t('round.lost')}
                </ThemedText>
              </View>
            );
          })}
        </ScrollView>
      )}

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity
          onPress={() => router.push('/screens/AddRoundScreen')}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[primaryColor, secondaryColor]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.primaryButton}
          >
            <ThemedText style={styles.buttonText}>
              ➕ {t('game.newRound')}
            </ThemedText>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleEndGame}
          activeOpacity={0.8}
        >
          <View style={[styles.secondaryButton, { borderColor: errorColor }]}>
            <ThemedText style={[styles.secondaryButtonText, { color: errorColor }]}>
              🏁 {t('game.endGame')}
            </ThemedText>
          </View>
        </TouchableOpacity>
      </View>

      {/* AdMob Banner */}
      <SkatBannerAd />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  noGameContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 30,
  },
  noGameText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  headerCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 2,
    alignItems: 'center',
    elevation: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 12,
    letterSpacing: 1,
  },
  roundBadge: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  roundBadgeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  leaderboard: {
    gap: 12,
    marginBottom: 20,
  },
  playerCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    elevation: 6,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  rankBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  rankEmoji: {
    fontSize: 28,
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  playerRank: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '600',
  },
  scoreChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  playerScore: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  roundHistory: {
    flex: 1,
    marginBottom: 20,
  },
  sectionHeader: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  roundCard: {
    borderRadius: 12,
    borderWidth: 2,
    padding: 14,
    marginBottom: 10,
    elevation: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  roundHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  roundNumberBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  roundNumber: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  roundGameType: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
  },
  roundScoreChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  roundScore: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  roundDeclarer: {
    fontSize: 14,
    opacity: 0.9,
  },
  actions: {
    gap: 12,
    marginTop: 10,
  },
  button: {
    height: 56,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  primaryButton: {
    height: 56,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#00D4FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
  },
  secondaryButton: {
    height: 56,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    backgroundColor: 'transparent',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  secondaryButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});
