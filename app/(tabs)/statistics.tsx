import { LinearGradient } from 'expo-linear-gradient';
import React, { useMemo } from 'react';
import { Dimensions, ScrollView, StyleSheet, View } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { Avatar, Card, Divider, List, ProgressBar, Text, useTheme } from 'react-native-paper';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useSelector } from 'react-redux';
import { RootState } from '../../src/store';

const screenWidth = Dimensions.get('window').width;

interface PlayerStat {
  gamesPlayed: number;
  gamesWon: number;
  totalScore: number;
  averageScore: number;
  winRate: number;
}

export default function StatisticsScreen() {
  const theme = useTheme();
  const { players, rounds } = useSelector((state: RootState) => state.game);

  const stats = useMemo(() => {
    const playerStats: Record<string, PlayerStat> = {};
    const gameTypeStats: Record<string, number> = {};

    players.forEach(player => {
      playerStats[player] = {
        gamesPlayed: 0,
        gamesWon: 0,
        totalScore: 0,
        averageScore: 0,
        winRate: 0,
      };
    });

    rounds.forEach(round => {
      const player = round.declarer;
      playerStats[player].gamesPlayed++;
      if (round.result === 'Won') playerStats[player].gamesWon++;
      playerStats[player].totalScore += round.scoreChange;
      gameTypeStats[round.gameType] = (gameTypeStats[round.gameType] || 0) + 1;
    });

    Object.keys(playerStats).forEach(player => {
      const s = playerStats[player];
      s.averageScore = s.gamesPlayed ? Math.round(s.totalScore / s.gamesPlayed) : 0;
      s.winRate = s.gamesPlayed ? s.gamesWon / s.gamesPlayed : 0;
    });

    const pieData = Object.entries(gameTypeStats).map(([type, count], i) => ({
      name: type,
      count,
      color: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'][i % 5],
      legendFontColor: '#333',
      legendFontSize: 12,
    }));

    return { playerStats, gameTypeStats, pieData };
  }, [players, rounds]);

  if (players.length === 0) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: theme.colors.background }]}>
        <Text variant="titleLarge">No statistics available</Text>
        <Text variant="bodyMedium" style={styles.emptyText}>Start a game to see statistics</Text>
      </View>
    );
  }

  return (
    <LinearGradient colors={['#D08CF9', '#DEB5F9', '#BB93F3']} style={{ flex: 1}}>
      <ScrollView style={[styles.container]} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text variant="displaySmall" style={styles.title}>Statistics</Text>
        </View>
        <Animated.View entering={FadeInUp.delay(100).springify()}>
          <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <Card.Title
              title="Overview"
              left={(props) => <Avatar.Icon {...props} icon="chart-bar" style={{ backgroundColor: theme.colors.primary }} />}
            />
            <Card.Content>
              <List.Item title="Total Games Played" description={rounds.length.toString()} left={(p) => <List.Icon {...p} icon="gamepad-variant" />} />
              <List.Item title="Active Players" description={players.length.toString()} left={(p) => <List.Icon {...p} icon="account-group" />} />
            </Card.Content>
          </Card>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(200).springify()}>
          <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <Card.Title
              title="Player Statistics"
              left={(props) => <Avatar.Icon {...props} icon="trophy" style={{ backgroundColor: theme.colors.primary }} />}
            />
            <Card.Content>
              {Object.entries(stats.playerStats).map(([player, playerStat], index) => (
                <Animated.View entering={FadeInUp.delay(150 * index).springify()} key={player} style={styles.playerStatContainer}>
                  <View style={styles.playerHeader}>
                    <Avatar.Text size={40} label={player[0].toUpperCase()} style={{ backgroundColor: theme.colors.secondary }} />
                    <Text variant="titleMedium" style={[styles.playerName, { color: theme.colors.primary }]}>{player}</Text>
                  </View>

                  <View style={styles.statRow}>
                    <Text variant="bodyMedium">Games Played</Text>
                    <Text variant="bodyMedium" style={styles.statValue}>{playerStat.gamesPlayed}</Text>
                  </View>

                  <View style={styles.statRow}>
                    <Text variant="bodyMedium">Win Rate</Text>
                    <Text variant="bodyMedium" style={styles.statValue}>{Math.round(playerStat.winRate * 100)}%</Text>
                  </View>
                  <ProgressBar progress={playerStat.winRate} color={theme.colors.primary} style={styles.progressBar} />

                  <View style={styles.statRow}>
                    <Text variant="bodyMedium">Average Score</Text>
                    <Text
                      variant="bodyMedium"
                      style={[
                        styles.statValue,
                        { color: playerStat.averageScore >= 0 ? theme.colors.primary : theme.colors.error },
                      ]}
                    >
                      {playerStat.averageScore}
                    </Text>
                  </View>

                  <Divider style={styles.divider} />
                </Animated.View>
              ))}
            </Card.Content>
          </Card>
        </Animated.View>

        {rounds.length > 0 && stats.pieData.length > 0 && (
          <Animated.View entering={FadeInUp.delay(400).springify()}>
            <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
              <Card.Title
                title="Game Type Distribution"
                left={(props) => <Avatar.Icon {...props} icon="chart-pie" style={{ backgroundColor: theme.colors.primary }} />}
              />
              <Card.Content>
                <PieChart
                  data={stats.pieData}
                  width={screenWidth - 64}
                  height={220}
                  chartConfig={{
                    backgroundColor: theme.colors.surface,
                    backgroundGradientFrom: theme.colors.surface,
                    backgroundGradientTo: theme.colors.surface,
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  }}
                  accessor="count"
                  backgroundColor="transparent"
                  paddingLeft="15"
                />
              </Card.Content>
            </Card>
          </Animated.View>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 24, paddingTop: 40, paddingBottom: 12 },
  title: { fontWeight: '700', color: '#FFFFFF', marginBottom: 6 },
  card: { margin: 16, borderRadius: 16, elevation: 3 },
  playerStatContainer: { marginBottom: 16, paddingVertical: 4 },
  playerHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 },
  playerName: { fontWeight: '600' },
  statRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 4 },
  statValue: { fontWeight: 'bold' },
  progressBar: { marginVertical: 8, height: 8, borderRadius: 4 },
  divider: { marginTop: 8, opacity: 0.4 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  emptyText: { marginTop: 8, opacity: 0.7 },
});
