# Skat Scoreboard App

A mobile scoreboard application for tracking Skat card game scores with multi-language support and Google AdMob monetization.

## Features

- ✅ **Multi-language Support** - German, English, French, Dutch
- ✅ **Complete Skat Rules** - Support for all game types (Grand, Suit games, Null variants)
- ✅ **Automatic Score Calculation** - Handles all modifiers (Hand, Schneider, Schwarz, Ouvert)
- ✅ **Game Persistence** - Saves current game and history locally
- ✅ **Google AdMob Integration** - Banner and interstitial ads
- ✅ **Dark Mode Support** - Automatically adapts to system theme
- ✅ **Cross-Platform** - iOS, Android, and Web support

## Tech Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Navigation**: Expo Router
- **Internationalization**: i18next, react-i18next
- **Storage**: AsyncStorage
- **Ads**: react-native-google-mobile-ads
- **UI**: React Native components with custom theming

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Expo CLI (`npm install -g expo-cli`)
- For iOS development: Xcode (macOS only)
- For Android development: Android Studio

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd Skat
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npx expo start
```

4. Run on your device
- iOS: Press `i` or scan QR code with Camera app
- Android: Press `a` or scan QR code with Expo Go app
- Web: Press `w`

## Google AdMob Configuration

### Test Ads (Default)

The app is currently configured with Google AdMob **test ad units**. These work out of the box for development and testing.

### Production Ads Setup

To use your own AdMob account for production:

1. **Create a Google AdMob Account**
   - Go to https://admob.google.com/
   - Sign in with your Google account
   - Create a new app

2. **Get Your App IDs**
   - In AdMob console, note your App ID for iOS and Android
   - Format: `ca-app-pub-XXXXXXXXXXXXXXXX~YYYYYYYYYY`

3. **Create Ad Units**
   - Create a Banner ad unit
   - Create an Interstitial ad unit
   - Note the Ad Unit IDs

4. **Update Configuration**

   Edit `app.json`:
   ```json
   {
     "plugins": [
       [
         "react-native-google-mobile-ads",
         {
           "androidAppId": "ca-app-pub-YOUR-ANDROID-APP-ID",
           "iosAppId": "ca-app-pub-YOUR-IOS-APP-ID"
         }
       ]
     ]
   }
   ```

   Edit `components/ads/BannerAd.tsx`:
   ```typescript
   const adUnitId = __DEV__
     ? TestIds.ADAPTIVE_BANNER
     : Platform.select({
         ios: 'ca-app-pub-xxxxxxxxxxxxx/YOUR-IOS-BANNER-UNIT-ID',
         android: 'ca-app-pub-xxxxxxxxxxxxx/YOUR-ANDROID-BANNER-UNIT-ID',
       });
   ```

   Edit `utils/ads.ts`:
   ```typescript
   const interstitialAdUnitId = __DEV__
     ? TestIds.INTERSTITIAL
     : Platform.select({
         ios: 'ca-app-pub-xxxxxxxxxxxxx/YOUR-IOS-INTERSTITIAL-UNIT-ID',
         android: 'ca-app-pub-xxxxxxxxxxxxx/YOUR-ANDROID-INTERSTITIAL-UNIT-ID',
       });
   ```

5. **Rebuild the app**
   ```bash
   npx expo prebuild --clean
   npx expo run:android  # or npx expo run:ios
   ```

## Project Structure

```
Skat/
├── app/                          # App screens and routing
│   ├── screens/                  # Main app screens
│   │   ├── SetupScreen.tsx      # Player setup
│   │   ├── ScoreboardScreen.tsx # Main scoreboard
│   │   └── AddRoundScreen.tsx   # Round entry form
│   ├── (tabs)/                  # Tab navigation
│   │   └── index.tsx            # Home screen
│   └── _layout.tsx              # Root layout
├── components/                   # Reusable components
│   ├── ads/                     # Ad components
│   │   └── BannerAd.tsx        # Banner ad wrapper
│   ├── ThemedText.tsx
│   └── ThemedView.tsx
├── context/                      # React Context
│   └── GameContext.tsx          # Game state management
├── types/                        # TypeScript types
│   └── game.ts                  # Game type definitions
├── utils/                        # Utility functions
│   ├── scoring.ts               # Skat scoring logic
│   ├── storage.ts               # AsyncStorage helpers
│   └── ads.ts                   # Ad management
├── locales/                      # Translation files
│   ├── en.json                  # English
│   ├── de.json                  # German
│   ├── fr.json                  # French
│   └── nl.json                  # Dutch
├── constants/
│   └── theme.ts                 # Theme configuration
├── i18n.ts                       # i18next configuration
├── app.json                      # Expo configuration
├── package.json
└── README.md
```

## How to Use

### Starting a New Game

1. Open the app
2. Select your preferred language
3. Tap "New Game"
4. Enter names for 3 players
5. Tap "Start Game"

### Recording a Round

1. Tap "New Round" on the scoreboard
2. Select the declarer (solo player)
3. Choose the game type (Grand, Suit, or Null)
4. Enter the bid value
5. Select modifiers if applicable (Hand, Schneider, Schwarz, Ouvert)
6. Mark as Won or Lost
7. Optionally enter actual points (0-120)
8. Tap "Add Round"

### Game Types Supported

- **Grand** - Jacks are trumps
- **Clubs/Spades/Hearts/Diamonds** - Suit games
- **Null** - No tricks allowed
- **Null Hand** - Null without skat
- **Null Ouvert** - Null with cards revealed
- **Null Ouvert Hand** - Combination

### Scoring Rules

The app automatically calculates scores based on official Skat rules:

- Base values for each game type
- Multipliers from consecutive jacks
- Modifiers (Hand +1, Schneider +1, etc.)
- Win/loss calculation
- Overbid penalties (double the loss)

## Building for Production

### Android

```bash
# Create production build
eas build --platform android --profile production

# Or local build
npx expo run:android --variant release
```

### iOS

```bash
# Create production build
eas build --platform ios --profile production

# Or local build
npx expo run:ios --configuration Release
```

## Adding New Languages

1. Create a new translation file in `locales/` (e.g., `es.json`)
2. Copy the structure from `en.json` and translate all strings
3. Add the language to `i18n.ts`:
   ```typescript
   import es from './locales/es.json';

   const resources = {
     // ... existing languages
     es: { translation: es },
   };
   ```
4. Add the language option to the home screen picker

## Troubleshooting

### AdMob not showing ads

- Make sure you've initialized AdMob in `_layout.tsx`
- Check your Ad Unit IDs are correct
- Test ads require a device (not simulator/emulator) for some platforms
- Production ads need app approval from Google (can take hours/days)

### Translation not working

- Clear app data and restart
- Check that the language code matches exactly (en, de, fr, nl)
- Verify all translation keys exist in all language files

### Build errors

```bash
# Clear cache and reinstall
rm -rf node_modules
npm install

# Clear Expo cache
npx expo start --clear
```

## License

This project is open source and available under the MIT License.

## Support

For issues or questions, please open an issue in the repository.

---

**Note**: This scoreboard app tracks scores only. It does not include the actual card game simulation.
