import AsyncStorage from '@react-native-async-storage/async-storage';
import { Game, AppSettings } from '../types/game';

const CURRENT_GAME_KEY = '@skat_current_game';
const GAME_HISTORY_KEY = '@skat_game_history';
const SETTINGS_KEY = '@skat_settings';

/**
 * Save the current active game
 */
export async function saveCurrentGame(game: Game): Promise<void> {
  try {
    await AsyncStorage.setItem(CURRENT_GAME_KEY, JSON.stringify(game));
  } catch (error) {
    console.error('Failed to save current game:', error);
    throw error;
  }
}

/**
 * Load the current active game
 */
export async function loadCurrentGame(): Promise<Game | null> {
  try {
    const gameJson = await AsyncStorage.getItem(CURRENT_GAME_KEY);
    if (!gameJson) return null;
    return JSON.parse(gameJson);
  } catch (error) {
    console.error('Failed to load current game:', error);
    return null;
  }
}

/**
 * Clear the current active game
 */
export async function clearCurrentGame(): Promise<void> {
  try {
    await AsyncStorage.removeItem(CURRENT_GAME_KEY);
  } catch (error) {
    console.error('Failed to clear current game:', error);
    throw error;
  }
}

/**
 * Save a completed game to history
 */
export async function saveGameToHistory(game: Game): Promise<void> {
  try {
    const historyJson = await AsyncStorage.getItem(GAME_HISTORY_KEY);
    const history: Game[] = historyJson ? JSON.parse(historyJson) : [];

    // Add game to history (newest first)
    history.unshift(game);

    // Keep only last 100 games
    const trimmedHistory = history.slice(0, 100);

    await AsyncStorage.setItem(GAME_HISTORY_KEY, JSON.stringify(trimmedHistory));
  } catch (error) {
    console.error('Failed to save game to history:', error);
    throw error;
  }
}

/**
 * Load game history
 */
export async function loadGameHistory(): Promise<Game[]> {
  try {
    const historyJson = await AsyncStorage.getItem(GAME_HISTORY_KEY);
    if (!historyJson) return [];
    return JSON.parse(historyJson);
  } catch (error) {
    console.error('Failed to load game history:', error);
    return [];
  }
}

/**
 * Delete a game from history
 */
export async function deleteGameFromHistory(gameId: string): Promise<void> {
  try {
    const history = await loadGameHistory();
    const filteredHistory = history.filter((game) => game.id !== gameId);
    await AsyncStorage.setItem(GAME_HISTORY_KEY, JSON.stringify(filteredHistory));
  } catch (error) {
    console.error('Failed to delete game from history:', error);
    throw error;
  }
}

/**
 * Clear all game history
 */
export async function clearGameHistory(): Promise<void> {
  try {
    await AsyncStorage.removeItem(GAME_HISTORY_KEY);
  } catch (error) {
    console.error('Failed to clear game history:', error);
    throw error;
  }
}

/**
 * Save app settings
 */
export async function saveSettings(settings: AppSettings): Promise<void> {
  try {
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save settings:', error);
    throw error;
  }
}

/**
 * Load app settings
 */
export async function loadSettings(): Promise<AppSettings | null> {
  try {
    const settingsJson = await AsyncStorage.getItem(SETTINGS_KEY);
    if (!settingsJson) return null;
    return JSON.parse(settingsJson);
  } catch (error) {
    console.error('Failed to load settings:', error);
    return null;
  }
}
