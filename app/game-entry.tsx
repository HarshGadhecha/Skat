import { useRewardedInterstitialAd } from '@/src/AdMob/RewardedInterstitialAd';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, Checkbox, Chip, SegmentedButtons, Text, TextInput, useTheme } from 'react-native-paper';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../src/store';
import { addRound } from '../src/store/gameSlice';

interface GameType {
    name: string;
    baseValue: number;
}

const GAME_TYPES: Record<string, GameType> = {
    CLUBS: { name: 'Clubs', baseValue: 12 },
    SPADES: { name: 'Spades', baseValue: 11 },
    HEARTS: { name: 'Hearts', baseValue: 10 },
    DIAMONDS: { name: 'Diamonds', baseValue: 9 },
    GRAND: { name: 'Grand', baseValue: 24 },
    NULL: { name: 'Null', baseValue: 23 },
    NULL_HAND: { name: 'Null Hand', baseValue: 35 },
    NULL_OUVERT: { name: 'Null Ouvert', baseValue: 46 },
    NULL_OUVERT_HAND: { name: 'Null Ouvert Hand', baseValue: 59 },
};

interface Modifiers {
    hand: boolean;
    ouvert: boolean;
    schneider: boolean;
    schwarz: boolean;
}

export default function GameEntryScreen() {
    const theme = useTheme();
    const dispatch = useDispatch();
    const { players, currentDealer } = useSelector((state: RootState) => state.game);
    const { isLoaded, isLoading, isClosed, isRewarded, show, load, reset } = useRewardedInterstitialAd();

    const [dealer] = useState(players[currentDealer]);
    const [declarer, setDeclarer] = useState('');
    const [gameType, setGameType] = useState('CLUBS');
    const [bidValue, setBidValue] = useState('');
    const [result, setResult] = useState<'Won' | 'Lost'>('Won');
    const [tricksWon, setTricksWon] = useState('');
    const [modifiers, setModifiers] = useState<Modifiers>({ hand: false, ouvert: false, schneider: false, schwarz: false });
    const [matadors, setMatadors] = useState('1');

    useEffect(() => {
        if (isClosed && isRewarded) saveRound();
        else if (isClosed && !isRewarded) {
            Alert.alert('Ad Not Completed', 'Your round will not be saved. Please watch the complete ad.', [
                { text: 'Cancel', style: 'cancel', onPress: () => reset() },
                { text: 'Try Again', onPress: () => { reset(); setTimeout(() => show(), 500); } },
            ]);
        }
    }, [isClosed, isRewarded]);

    const calculateGameValue = (): number => {
        const baseValue = GAME_TYPES[gameType].baseValue;
        let multiplier = parseInt(matadors) || 1;
        if (modifiers.hand) multiplier++;
        if (modifiers.ouvert) multiplier++;
        if (modifiers.schneider) multiplier++;
        if (modifiers.schwarz) multiplier++;
        return baseValue * multiplier;
    };

    const handleSaveRound = () => {
        if (!declarer || !bidValue) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }
        if (!isLoaded) {
            Alert.alert('Ad Not Ready', 'Please wait while the ad loads...', [{ text: 'OK', onPress: () => load() }]);
            return;
        }
        Alert.alert('Watch Ad to Save', 'In order to save round, watch the complete ad', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Watch Ad', onPress: () => show() },
        ]);
    };

    const saveRound = () => {
        const gameValue = calculateGameValue();
        const scoreChange = result === 'Won' ? gameValue : -gameValue * 2;
        dispatch(addRound({
            dealer, declarer, gameType: GAME_TYPES[gameType].name,
            bidValue: parseInt(bidValue),
            gameValue, result,
            tricksWon: tricksWon ? parseInt(tricksWon) : null,
            scoreChange, modifiers,
        }));
        Alert.alert('✅ Round Saved!', 'Round saved successfully!', [{ text: 'OK', onPress: () => router.back() }]);
    };

    return (
        <LinearGradient colors={['#2e193bff', '#4f266aff', '#442d64ff']} style={{ flex: 1 }}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false} >
                    <Animated.View entering={FadeInUp.springify()} style={styles.header}>
                        <Text variant="displaySmall" style={styles.headerTitle}>New Game Round</Text>
                        <Text variant="bodyLarge" style={styles.headerSubtitle}>Enter round details below</Text>
                    </Animated.View>

                    {/* Dealer Card */}
                    <Animated.View entering={FadeInUp.delay(100).springify()}>
                        <Card style={styles.card}>
                            <Card.Content style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Text variant="titleMedium" style={{ fontWeight: '600' }}>Dealer:</Text>
                                <Chip style={styles.chip}>{dealer}</Chip>
                            </Card.Content>
                        </Card>
                    </Animated.View>


                    {/* Declarer */}
                    <Animated.View entering={FadeInUp.delay(200).springify()}>
                        <Card style={styles.card}>
                            <Text variant="titleMedium" style={{ fontWeight: '600', margin: 15 }}>Declarer *</Text>
                            <Card.Content>
                                <View style={styles.rowWrap}>
                                    {players.filter(p => p !== dealer).map((p) => (
                                        <Button key={p} mode={declarer === p ? 'contained' : 'outlined'} onPress={() => setDeclarer(p)} style={styles.playerButton}>{p}</Button>
                                    ))}
                                </View>
                            </Card.Content>
                        </Card>
                    </Animated.View>

                    {/* Game Type */}
                    <Animated.View entering={FadeInUp.delay(300).springify()}>
                        <Card style={styles.card}>
                            <Text variant="titleMedium" style={{ fontWeight: '600', margin: 15 }}>Game Type *</Text>
                            <Card.Content>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                    <SegmentedButtons
                                        value={gameType}
                                        onValueChange={setGameType}
                                        buttons={[
                                            { value: 'CLUBS', label: '♣️ Clubs' },
                                            { value: 'SPADES', label: '♠️ Spades' },
                                            { value: 'HEARTS', label: '♥️ Hearts' },
                                            { value: 'DIAMONDS', label: '♦️ Diamonds' },
                                            { value: 'GRAND', label: 'Grand' },
                                        ]}
                                    />
                                </ScrollView>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 8 }}>
                                    <SegmentedButtons
                                        value={gameType}
                                        onValueChange={setGameType}
                                        buttons={[
                                            { value: 'NULL', label: 'Null' },
                                            { value: 'NULL_HAND', label: 'Null Hand' },
                                            { value: 'NULL_OUVERT', label: 'Null Ouvert' },
                                            { value: 'NULL_OUVERT_HAND', label: 'Null OH' },
                                        ]}
                                    />
                                </ScrollView>
                            </Card.Content>
                        </Card>
                    </Animated.View>

                    {/* Modifiers */}
                    <Animated.View entering={FadeInUp.delay(400).springify()}>
                        <Card style={styles.card}>
                            <Text variant="titleMedium" style={{ fontWeight: '600', marginHorizontal: 16, marginTop: 16 }}>Modifiers</Text>
                            <Text style={{ marginHorizontal: 16, marginBottom: 8, color: 'gray', fontSize: 14, marginTop: 5 }}>
                                Check the boxes that apply
                            </Text>
                            <Card.Content>
                                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 5 }}>
                                    {Object.keys(modifiers).map((key) => (
                                        <View key={key} style={{ width: '49%', borderWidth: 1, borderColor: 'gray', borderRadius: 8 }}>
                                            <Checkbox.Item
                                                label={key.charAt(0).toUpperCase() + key.slice(1)}
                                                status={modifiers[key as keyof Modifiers] ? 'checked' : 'unchecked'}
                                                onPress={() => setModifiers({ ...modifiers, [key]: !modifiers[key as keyof Modifiers] })}
                                                color={theme.colors.primary}
                                                uncheckedColor={'black'}
                                            />
                                        </View>
                                    ))}
                                </View>

                                <View style={styles.matadorBox}>
                                    <Text variant="titleMedium" style={{ fontWeight: '600', margin: 10 }}>Matadors</Text>
                                    <SegmentedButtons
                                        value={matadors}
                                        onValueChange={setMatadors}
                                        buttons={[{ value: '1', label: '1' }, { value: '2', label: '2' }, { value: '3', label: '3' }, { value: '4', label: '4' }]}
                                    />
                                </View>
                            </Card.Content>
                        </Card>
                    </Animated.View>

                    {/* Values */}
                    <Animated.View entering={FadeInUp.delay(500).springify()}>
                        <Card style={styles.card}>
                            <Text variant="titleMedium" style={{ fontWeight: '600', marginHorizontal: 15, marginTop: 15 }}>Values</Text>
                            <Card.Content>
                                <TextInput label="Bid Value *" value={bidValue} onChangeText={setBidValue} keyboardType="numeric" mode="outlined" style={styles.input} />
                                <View style={styles.rowBetween}>
                                    <Text variant="titleMedium">Calculated Game Value:</Text>
                                    <Chip style={styles.valueChip}>{calculateGameValue()}</Chip>
                                </View>
                            </Card.Content>
                        </Card>
                    </Animated.View>

                    {/* Result */}
                    <Animated.View entering={FadeInUp.delay(600).springify()}>
                        <Card style={styles.card}>
                            <Text variant="titleMedium" style={{ fontWeight: '600', margin: 15 }}>Result *</Text>
                            <Card.Content>
                                <SegmentedButtons
                                    value={result}
                                    onValueChange={(v) => setResult(v as 'Won' | 'Lost')}
                                    buttons={[{ value: 'Won', label: 'Won' }, { value: 'Lost', label: 'Lost' }]}
                                />
                                <TextInput label="Tricks Won (Optional)" value={tricksWon} onChangeText={setTricksWon} keyboardType="numeric" mode="outlined" style={[styles.input, { marginTop: 16 }]} />
                            </Card.Content>
                        </Card>
                    </Animated.View>

                    <View style={styles.scorePreview}>
                        <Text variant="titleLarge">Score Change:</Text>
                        <Text variant="headlineMedium" style={{ color: result === 'Won' ? theme.colors.primary : theme.colors.error, fontWeight: 'bold' }}>
                            {result === 'Won' ? '+' : '-'}
                            {result === 'Won' ? calculateGameValue() : calculateGameValue() * 2}
                        </Text>
                    </View>
                </ScrollView>

                {/* Fixed Bottom Buttons */}
                <View style={styles.bottomButtons}>
                    <Button mode="outlined" onPress={() => router.back()} style={styles.actionBtn}>Cancel</Button>
                    <Button mode="contained" onPress={handleSaveRound} style={styles.actionBtn} disabled={isLoading}>
                        {isLoading ? 'Loading Ad...' : 'Save Round'}
                    </Button>
                </View>
            </KeyboardAvoidingView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    header: { paddingHorizontal: 24, paddingTop: 40, paddingBottom: 12 },
    headerTitle: { fontWeight: '700', color: '#FFFFFF', marginBottom: 6 },
    headerSubtitle: { color: '#FFFFFF', opacity: 0.9 },
    card: { marginHorizontal: 16, marginVertical: 6, borderRadius: 16, elevation: 4 },
    chip: { alignSelf: 'flex-start' },
    playerButton: { margin: 4 },
    rowWrap: { flexDirection: 'row', flexWrap: 'wrap' },
    input: { marginTop: 8 },
    rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 },
    valueChip: {},
    matadorBox: { marginTop: 16 },
    scorePreview: { alignItems: 'center', marginTop: 16, marginBottom: 32 },
    bottomButtons: { position: 'absolute', bottom: 0, flexDirection: 'row', justifyContent: 'space-between', width: '100%', backgroundColor: '#fff', padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20, elevation: 10 },
    actionBtn: { flex: 0.48, borderRadius: 10 },
});
