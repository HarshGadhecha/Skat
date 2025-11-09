import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

import en from './locales/en.json';
import de from './locales/de.json';
import fr from './locales/fr.json';
import nl from './locales/nl.json';

const LANGUAGE_KEY = '@skat_scoreboard_language';

// Get saved language or use device locale
const getInitialLanguage = async () => {
  try {
    const savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
    if (savedLanguage) {
      return savedLanguage;
    }

    // Fallback to device locale
    const deviceLanguage = Localization.locale.split('-')[0];
    const supportedLanguages = ['en', 'de', 'fr', 'nl'];
    return supportedLanguages.includes(deviceLanguage) ? deviceLanguage : 'en';
  } catch (error) {
    return 'en';
  }
};

const resources = {
  en: { translation: en },
  de: { translation: de },
  fr: { translation: fr },
  nl: { translation: nl },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // Will be updated dynamically
    fallbackLng: 'en',
    compatibilityJSON: 'v3',
    interpolation: {
      escapeValue: false,
    },
  });

// Initialize with saved or device language
getInitialLanguage().then((language) => {
  i18n.changeLanguage(language);
});

// Helper function to save language preference
export const changeLanguage = async (language: string) => {
  try {
    await AsyncStorage.setItem(LANGUAGE_KEY, language);
    await i18n.changeLanguage(language);
  } catch (error) {
    console.error('Failed to save language preference:', error);
  }
};

export default i18n;
