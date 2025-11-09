import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Alert, Linking, Platform, ScrollView, StyleSheet, View } from 'react-native';
import {
    Button,
    Card,
    Dialog,
    Divider,
    List,
    Portal,
    Switch,
    Text,
    useTheme
} from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../src/store';
import { clearGameData } from '../../src/store/gameSlice';
import { loadSettings, toggleDarkMode, toggleSound, toggleVibration } from '../../src/store/settingsSlice';

export default function SettingsScreen() {
    const theme = useTheme();
    const dispatch = useDispatch();
    const { sound, vibration, darkMode } = useSelector((state: RootState) => state.settings);
    const [clearDialogVisible, setClearDialogVisible] = React.useState(false);

    // ✅ Load saved settings from AsyncStorage when screen mounts
    React.useEffect(() => {
        const loadStoredSettings = async () => {
            try {
                const saved = await AsyncStorage.getItem('@skat_settings');
                if (saved) {
                    dispatch(loadSettings(JSON.parse(saved)));
                }
            } catch (e) {
                console.log('Error loading settings:', e);
            }
        };
        loadStoredSettings();
    }, []);

    // ✅ Handles toggle + persistence
    const handleToggle = async (type: 'sound' | 'vibration' | 'darkMode') => {
        try {
            if (type === 'sound') dispatch(toggleSound());
            if (type === 'vibration') dispatch(toggleVibration());
            if (type === 'darkMode') dispatch(toggleDarkMode());

            // Save updated settings
            const newState = {
                sound: type === 'sound' ? !sound : sound,
                vibration: type === 'vibration' ? !vibration : vibration,
                darkMode: type === 'darkMode' ? !darkMode : darkMode,
            };
            await AsyncStorage.setItem('@skat_settings', JSON.stringify(newState));
        } catch (e) {
            console.log('Error saving settings:', e);
        }
    };

    const handleClearData = () => {
        Alert.alert(
            'Clear All Data',
            'This will delete all players, rounds, and statistics. This action cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Clear',
                    style: 'destructive',
                    onPress: () => {
                        dispatch(clearGameData());
                        setClearDialogVisible(false);
                    },
                },
            ]
        );
    };

    const openPrivacyPolicy = () => {
        Linking.openURL('https://yourapp.com/privacy-policy');
    };

    return (
        <LinearGradient colors={['#D08CF9', '#DEB5F9', '#BB93F3']} style={{ flex: 1 }}        >
            <ScrollView style={[styles.container]}>
                <View style={styles.header}>
                    <Text variant="displaySmall" style={styles.title}>Settings</Text>
                </View>

                {/* Preferences Card */}
                <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
                    <Card.Title title="Preferences" />
                    <Card.Content>
                        {/* <List.Item
            title="Sound Effects"
            description="Play sounds for game actions"
            left={(props) => <List.Icon {...props} icon="volume-high" />}
            right={() => (
              <Switch
                value={sound}
                onValueChange={() => handleToggle('sound')}
                color={theme.colors.primary}
              />
            )}
          />
          <Divider />
          <List.Item
            title="Vibration"
            description="Vibrate on game actions"
            left={(props) => <List.Icon {...props} icon="vibrate" />}
            right={() => (
              <Switch
                value={vibration}
                onValueChange={() => handleToggle('vibration')}
                color={theme.colors.primary}
              />
            )}
          /> */}
                        {Platform.OS !== 'web' && (
                            <>
                                {/* <Divider /> */}
                                <List.Item
                                    title="Dark Mode"
                                    description="Use dark theme"
                                    left={(props) => <List.Icon {...props} icon="theme-light-dark" />}
                                    right={() => (
                                        <Switch
                                            value={darkMode}
                                            onValueChange={() => handleToggle('darkMode')}
                                            color={theme.colors.primary}
                                        />
                                    )}
                                />
                            </>
                        )}
                    </Card.Content>
                </Card>

                {/* Data Management */}
                <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
                    <Card.Title title="Data Management" />
                    <Card.Content>
                        <Button
                            mode="contained"
                            onPress={() => setClearDialogVisible(true)}
                            style={styles.clearButton}
                            buttonColor={theme.colors.error}
                        >
                            Clear All Data
                        </Button>
                        <Text variant="bodySmall" style={styles.warningText}>
                            This will delete all game data permanently
                        </Text>
                    </Card.Content>
                </Card>

                {/* About Section */}
                <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
                    <Card.Title title="About" />
                    <Card.Content>
                        {/* <List.Item
                        title="Version"
                        description="1.0.0"
                        left={(props) => <List.Icon {...props} icon="information" />}
                    />
                    <Divider /> */}
                        <List.Item
                            title="Privacy Policy"
                            description="View our privacy policy"
                            left={(props) => <List.Icon {...props} icon="shield-lock" />}
                            right={(props) => <List.Icon {...props} icon="chevron-right" />}
                            onPress={openPrivacyPolicy}
                        />
                        <Divider />
                        <List.Item
                            title="Contact Support"
                            description="Get help with the app"
                            left={(props) => <List.Icon {...props} icon="email" />}
                            right={(props) => <List.Icon {...props} icon="chevron-right" />}
                            onPress={() => Linking.openURL('mailto:support@skatscoreboard.com')}
                        />
                    </Card.Content>
                </Card>

                {/* Clear Data Dialog */}
                <Portal>
                    <Dialog visible={clearDialogVisible} onDismiss={() => setClearDialogVisible(false)}>
                        <Dialog.Title>Clear All Data?</Dialog.Title>
                        <Dialog.Content>
                            <Text>
                                This will permanently delete all players, rounds, and statistics. This action cannot be undone.
                            </Text>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={() => setClearDialogVisible(false)}>Cancel</Button>
                            <Button onPress={handleClearData} textColor={theme.colors.error}>
                                Clear
                            </Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
            </ScrollView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: { paddingHorizontal: 24, paddingTop: 40, paddingBottom: 12 },
    title: { fontWeight: '700', color: '#FFFFFF', marginBottom: 6 },
    card: {
        marginHorizontal: 16,
        marginVertical: 10,
        elevation: 2,
    },
    clearButton: {
        marginVertical: 8,
    },
    warningText: {
        textAlign: 'center',
        opacity: 0.7,
        marginTop: 8,
    },
});
