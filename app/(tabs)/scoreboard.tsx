import { deleteLastRound } from '@/src/store/gameSlice';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import { Alert, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import { Card, Chip, FAB, Text, useTheme } from 'react-native-paper';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../src/store';

export default function ScoreboardScreen() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { players, rounds, totals } = useSelector((state: RootState) => state.game);

  const handleDeleteRound = (item) => {
    Alert.alert(
      'Delete Round',
      `Are you sure you want to delete Round ${item.roundNumber}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => dispatch(deleteLastRound(item.id)) },
      ]
    );
  };

  const renderRound = ({ item }) => {
    const isWon = item.result === 'Won';
    return (
      <Card
        key={item.id?.toString() || item.roundNumber.toString()}
        style={[styles.roundCard, { backgroundColor: theme.colors.surface }]} onLongPress={() => handleDeleteRound(item)}>
        <Card.Content>
          <View style={styles.roundHeader}>
            <Text variant="titleMedium" style={styles.roundTitle}>Round {item.roundNumber}</Text>
            <Chip mode="flat" style={[styles.resultChip, { backgroundColor: isWon ? theme.colors.secondaryContainer : theme.colors.errorContainer }]} textStyle={{ color: isWon ? theme.colors.onSecondaryContainer : theme.colors.onErrorContainer, fontWeight: 'bold' }}>{isWon ? '+' : '-'}{Math.abs(item.scoreChange)}</Chip>
          </View>
          <View style={styles.roundDetails}>
            <Text variant="bodyMedium">Declarer: {item.declarer}</Text>
            <Text variant="bodyMedium">Game: {item.gameType}</Text>
            <Text variant="bodyMedium" style={{ color: isWon ? theme.colors.primary : theme.colors.error, fontWeight: 'bold' }}>{item.result}</Text>
          </View>
        </Card.Content>
      </Card>
    );
  };

  if (players.length === 0) {
    return (
      <LinearGradient colors={['#D08CF9', '#DEB5F9', '#BB93F3']} style={{ flex: 1 }}>
        <View style={styles.emptyState}>
          <Text variant="headlineMedium" style={styles.emptyTitle}>No Game in Progress</Text>
          <Text variant="bodyLarge" style={styles.emptyText}>Set up players to start a new game</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#D08CF9', '#DEB5F9', '#BB93F3']} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <View style={styles.header}>
          <Text variant="displaySmall" style={styles.title}>Leaderboard</Text>
          <Text variant="bodyLarge" style={styles.subtitle}>Current player standings</Text>
        </View>

        {[...players]
          .sort((a, b) => (totals[b] || 0) - (totals[a] || 0))
          .map((player, index) => {
            const score = totals[player] || 0;
            const rank = index + 1;
            const isTop = rank === 1;
            return (
              <Animated.View
                entering={FadeInUp.delay(index * 100).springify()}
                key={player}
                style={[
                  styles.leaderCard,
                  { backgroundColor: rank === 1 ? '#FDE68A' : rank === 2 ? '#E0E7FF' : '#E5E7EB' },
                ]}
              >
                <View style={styles.rankContainer}>
                  <MaterialCommunityIcons
                    name={isTop ? 'crown' : 'trophy'}
                    size={26}
                    color={isTop ? '#FFD700' : '#6B7280'}
                  />
                  <Text style={styles.rankText}>#{rank}</Text>
                </View>

                <View style={styles.playerInfo}>
                  <Text style={styles.playerName}>{player}</Text>
                </View>

                <View style={styles.scoreContainer}>
                  <Text style={[styles.scoreText, { color: score >= 0 ? '#10B981' : '#EF4444' }]}>
                    {score}
                  </Text>
                </View>
              </Animated.View>
            );
          })}

        <Text variant="headlineSmall" style={[styles.roundTitle, { marginHorizontal: 16 }]}>All Rounds</Text>

        {rounds.length === 0 ? (
          <Text variant="bodyLarge" style={styles.noRoundsText}>No rounds played yet</Text>
        ) : (
          rounds.map((r) => renderRound({ item: r }))
        )}
      </ScrollView>

      <FAB style={[styles.fab, { backgroundColor: theme.colors.primary }]} icon="plus" label="Add Round" onPress={() => router.push('/game-entry')} uppercase={false} />

      {Platform.OS !== 'web' && (
        <View style={styles.bannerContainer}>
          <BannerAd
            unitId={__DEV__ ? TestIds.BANNER : Platform.OS === 'ios' ? 'ca-app-pub-2586473739778438/6390721597' : 'ca-app-pub-2586473739778438/6541204335'}
            size={BannerAdSize.FULL_BANNER}
            requestOptions={{ requestNonPersonalizedAdsOnly: true }}
          />
        </View>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 24, paddingTop: 40, paddingBottom: 12 },
  title: { fontWeight: '700', color: '#FFFFFF', marginBottom: 6 },
  subtitle: { color: '#FFFFFF', opacity: 0.9 },
  leaderCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderRadius: 16, paddingVertical: 10, paddingHorizontal: 16, marginHorizontal: 16, marginVertical: 6, elevation: 3 },
  rankContainer: { flexDirection: 'row', alignItems: 'center', width: 70 },
  rankText: { fontSize: 16, fontWeight: 'bold', marginLeft: 6, color: '#4B5563' },
  playerInfo: { flex: 1 },
  playerName: { fontSize: 18, fontWeight: '600', color: '#1F2937' },
  scoreContainer: { width: 70, alignItems: 'flex-end' },
  scoreText: { fontSize: 18, fontWeight: 'bold' },
  roundCard: { marginVertical: 6, marginHorizontal: 16, borderRadius: 16, elevation: 3 },
  roundHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  resultChip: { minHeight: 32 },
  roundDetails: { flexDirection: 'row', justifyContent: 'space-between' },
  roundTitle: { fontWeight: '700', marginTop: 16, color: '#fff' },
  noRoundsText: { textAlign: 'center', marginTop: 32, color: '#fff', opacity: 0.8 },
  fab: { position: 'absolute', right: 20, bottom: 80, borderRadius: 28, elevation: 6 },
  bannerContainer: { position: 'absolute', bottom: 0, width: '100%', backgroundColor: '#fff' },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 },
  emptyTitle: { color: '#fff', fontWeight: 'bold', marginBottom: 8 },
  emptyText: { color: '#fff', opacity: 0.8, textAlign: 'center' },
});
