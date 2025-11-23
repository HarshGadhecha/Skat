/**
 * Gaming-themed colors with vibrant dark mode palette
 * Rich colors for an immersive Skat game experience
 */

import { Platform } from 'react-native';

// Vibrant gaming color palette
const gameColors = {
  // Primary accent colors - vibrant and lively
  neonBlue: '#00D4FF',
  neonPurple: '#B24BF3',
  neonPink: '#FF006E',
  neonGreen: '#00FF94',
  neonOrange: '#FF6B35',
  neonYellow: '#FFD23F',

  // Rich gradients
  gradientStart: '#1A0B2E',
  gradientMid: '#2D1B4E',
  gradientEnd: '#4A2C6D',

  // Card suit colors
  clubs: '#00D4FF',      // Bright cyan
  spades: '#B24BF3',     // Vivid purple
  hearts: '#FF006E',     // Hot pink
  diamonds: '#FF6B35',   // Vivid orange

  // Game state colors
  win: '#00FF94',
  loss: '#FF006E',
  warning: '#FFD23F',

  // Dark backgrounds
  deepDark: '#0A0118',
  darkPurple: '#1A0B2E',
  richDark: '#16001E',
  cardDark: '#251142',

  // Glass-morphism effects
  glassLight: 'rgba(255, 255, 255, 0.1)',
  glassDark: 'rgba(0, 0, 0, 0.3)',
};

const tintColorLight = '#B24BF3';
const tintColorDark = '#00D4FF';

export const Colors = {
  light: {
    text: '#1A0B2E',
    background: '#F8F7FF',
    tint: tintColorLight,
    icon: '#6D28D9',
    tabIconDefault: '#9333EA',
    tabIconSelected: tintColorLight,
    border: '#E9D5FF',
    inputBackground: '#FFFFFF',
    card: '#FFFFFF',
    cardBorder: '#DDD6FE',
    primary: '#B24BF3',
    secondary: '#00D4FF',
    accent: '#FF006E',
    success: '#00FF94',
    error: '#FF006E',
    warning: '#FFD23F',
    gradient1: '#E9D5FF',
    gradient2: '#DBEAFE',
    gradient3: '#FBCFE8',
  },
  dark: {
    text: '#FFFFFF',
    background: gameColors.deepDark,
    tint: tintColorDark,
    icon: '#00D4FF',
    tabIconDefault: '#B24BF3',
    tabIconSelected: tintColorDark,
    border: 'rgba(178, 75, 243, 0.3)',
    inputBackground: gameColors.cardDark,
    card: gameColors.cardDark,
    cardBorder: 'rgba(0, 212, 255, 0.3)',

    // Rich gaming colors
    primary: '#00D4FF',
    secondary: '#B24BF3',
    accent: '#FF006E',
    success: '#00FF94',
    error: '#FF006E',
    warning: '#FFD23F',

    // Gradient colors for backgrounds
    gradient1: gameColors.gradientStart,
    gradient2: gameColors.gradientMid,
    gradient3: gameColors.gradientEnd,

    // Suit colors
    clubs: gameColors.clubs,
    spades: gameColors.spades,
    hearts: gameColors.hearts,
    diamonds: gameColors.diamonds,

    // Glass-morphism
    glass: gameColors.glassLight,
    glassDark: gameColors.glassDark,

    // Player rank colors
    rank1: '#FFD700', // Gold
    rank2: '#C0C0C0', // Silver
    rank3: '#CD7F32', // Bronze

    // Shadows and glows
    shadowColor: '#000000',
    glowPrimary: 'rgba(0, 212, 255, 0.5)',
    glowSecondary: 'rgba(178, 75, 243, 0.5)',
    glowAccent: 'rgba(255, 0, 110, 0.5)',
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
