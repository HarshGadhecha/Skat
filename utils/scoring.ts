import { GameType, RoundModifiers, BASE_VALUES } from '../types/game';

/**
 * Calculate the multiplier for a Skat game based on jacks and modifiers
 * In a real game, this would be calculated based on consecutive jacks
 * For scoreboard purposes, we'll calculate it from the bid value
 */
export function calculateMultiplierFromBid(
  gameType: GameType,
  bidValue: number,
  modifiers: RoundModifiers
): number {
  const baseValue = BASE_VALUES[gameType];

  // For Null games, multiplier is always 1
  if (gameType.startsWith('null')) {
    return 1;
  }

  // Calculate base multiplier from bid value
  let multiplier = Math.ceil(bidValue / baseValue);

  // Adjust for modifiers that affect multiplier
  if (modifiers.hand) multiplier += 1;
  if (modifiers.schneider) multiplier += 1;
  if (modifiers.schneiderAnnounced) multiplier += 1;
  if (modifiers.schwarz) multiplier += 1;
  if (modifiers.schwarzAnnounced) multiplier += 1;
  if (modifiers.ouvert) multiplier += 1;

  return Math.max(1, multiplier);
}

/**
 * Calculate the game value based on base value and multiplier
 */
export function calculateGameValue(
  gameType: GameType,
  multiplier: number
): number {
  const baseValue = BASE_VALUES[gameType];
  return baseValue * multiplier;
}

/**
 * Calculate the final score for a round
 */
export function calculateRoundScore(
  gameType: GameType,
  bidValue: number,
  modifiers: RoundModifiers,
  won: boolean,
  actualPoints: number = 0
): number {
  // For Null games, fixed values
  if (gameType.startsWith('null')) {
    const nullValue = BASE_VALUES[gameType];
    return won ? nullValue : -2 * nullValue;
  }

  // Calculate multiplier and game value
  const multiplier = calculateMultiplierFromBid(gameType, bidValue, modifiers);
  const gameValue = calculateGameValue(gameType, multiplier);

  // If won, return positive game value
  if (won) {
    return gameValue;
  }

  // If lost, return negative value
  // If game was worth less than bid, double the loss
  if (gameValue < bidValue) {
    return -2 * bidValue;
  }

  return -2 * gameValue;
}

/**
 * Validate if a bid value is possible for a given game type
 */
export function isValidBid(gameType: GameType, bidValue: number): boolean {
  const baseValue = BASE_VALUES[gameType];

  // Bid must be a multiple of base value
  if (bidValue % baseValue !== 0) {
    return false;
  }

  // Minimum bid is 18 (except for Null games which have fixed values)
  if (!gameType.startsWith('null') && bidValue < 18) {
    return false;
  }

  return true;
}

/**
 * Get minimum valid bid for a game type
 */
export function getMinimumBid(gameType: GameType): number {
  if (gameType.startsWith('null')) {
    return BASE_VALUES[gameType];
  }
  return 18;
}

/**
 * Calculate points needed for Schneider (31+) and Schwarz (all tricks)
 */
export const SCHNEIDER_THRESHOLD = 31;
export const SCHNEIDER_WIN_THRESHOLD = 90;

/**
 * Determine if player made Schneider/Schwarz based on points
 */
export function getAchievedModifiers(points: number) {
  return {
    schneider: points >= SCHNEIDER_WIN_THRESHOLD || points <= SCHNEIDER_THRESHOLD,
    schwarz: points === 0 || points === 120,
  };
}
