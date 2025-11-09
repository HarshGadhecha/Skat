// Game types for Skat
export type GameType =
  | 'grand'
  | 'clubs'
  | 'spades'
  | 'hearts'
  | 'diamonds'
  | 'null'
  | 'nullHand'
  | 'nullOuvert'
  | 'nullOuvertHand';

// Base values for game types
export const BASE_VALUES: Record<GameType, number> = {
  grand: 24,
  clubs: 12,
  spades: 11,
  hearts: 10,
  diamonds: 9,
  null: 23,
  nullHand: 35,
  nullOuvert: 46,
  nullOuvertHand: 59,
};

// Player information
export interface Player {
  id: string;
  name: string;
  totalScore: number;
}

// Round modifiers
export interface RoundModifiers {
  hand: boolean;
  schneider: boolean;
  schneiderAnnounced: boolean;
  schwarz: boolean;
  schwarzAnnounced: boolean;
  ouvert: boolean;
}

// Single round of Skat
export interface Round {
  id: string;
  roundNumber: number;
  declarerId: string;
  gameType: GameType;
  bidValue: number;
  modifiers: RoundModifiers;
  won: boolean;
  actualPoints: number; // Points actually achieved
  calculatedScore: number; // Score for this round
  timestamp: number;
}

// Complete game
export interface Game {
  id: string;
  players: Player[];
  rounds: Round[];
  startTime: number;
  endTime?: number;
  isActive: boolean;
}

// Game statistics
export interface GameStatistics {
  totalGames: number;
  totalRounds: number;
  playerStats: {
    [playerId: string]: {
      gamesWon: number;
      gamesLost: number;
      totalPoints: number;
      averageScore: number;
      highestScore: number;
      lowestScore: number;
    };
  };
}

// Language type
export type Language = 'en' | 'de' | 'fr' | 'nl';

// App settings
export interface AppSettings {
  language: Language;
  theme: 'light' | 'dark' | 'system';
}
