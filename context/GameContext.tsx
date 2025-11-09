import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Game, Player, Round, GameType, RoundModifiers } from '../types/game';
import {
  saveCurrentGame,
  loadCurrentGame,
  clearCurrentGame,
  saveGameToHistory,
} from '../utils/storage';
import { calculateRoundScore } from '../utils/scoring';

interface GameContextType {
  currentGame: Game | null;
  startNewGame: (playerNames: string[]) => void;
  addRound: (
    declarerId: string,
    gameType: GameType,
    bidValue: number,
    modifiers: RoundModifiers,
    won: boolean,
    actualPoints: number
  ) => void;
  endGame: () => Promise<void>;
  loadGame: () => Promise<void>;
  isLoading: boolean;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [currentGame, setCurrentGame] = useState<Game | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load current game on mount
  useEffect(() => {
    loadGame();
  }, []);

  // Save current game whenever it changes
  useEffect(() => {
    if (currentGame && currentGame.isActive) {
      saveCurrentGame(currentGame);
    }
  }, [currentGame]);

  const loadGame = async () => {
    setIsLoading(true);
    try {
      const game = await loadCurrentGame();
      setCurrentGame(game);
    } catch (error) {
      console.error('Failed to load game:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const startNewGame = (playerNames: string[]) => {
    const players: Player[] = playerNames.map((name, index) => ({
      id: `player-${index}-${Date.now()}`,
      name,
      totalScore: 0,
    }));

    const newGame: Game = {
      id: `game-${Date.now()}`,
      players,
      rounds: [],
      startTime: Date.now(),
      isActive: true,
    };

    setCurrentGame(newGame);
  };

  const addRound = (
    declarerId: string,
    gameType: GameType,
    bidValue: number,
    modifiers: RoundModifiers,
    won: boolean,
    actualPoints: number
  ) => {
    if (!currentGame) return;

    const calculatedScore = calculateRoundScore(
      gameType,
      bidValue,
      modifiers,
      won,
      actualPoints
    );

    const newRound: Round = {
      id: `round-${Date.now()}`,
      roundNumber: currentGame.rounds.length + 1,
      declarerId,
      gameType,
      bidValue,
      modifiers,
      won,
      actualPoints,
      calculatedScore,
      timestamp: Date.now(),
    };

    // Update player scores
    const updatedPlayers = currentGame.players.map((player) => {
      if (player.id === declarerId) {
        return {
          ...player,
          totalScore: player.totalScore + calculatedScore,
        };
      }
      return player;
    });

    const updatedGame: Game = {
      ...currentGame,
      players: updatedPlayers,
      rounds: [...currentGame.rounds, newRound],
    };

    setCurrentGame(updatedGame);
  };

  const endGame = async () => {
    if (!currentGame) return;

    const completedGame: Game = {
      ...currentGame,
      endTime: Date.now(),
      isActive: false,
    };

    try {
      await saveGameToHistory(completedGame);
      await clearCurrentGame();
      setCurrentGame(null);
    } catch (error) {
      console.error('Failed to end game:', error);
    }
  };

  return (
    <GameContext.Provider
      value={{
        currentGame,
        startNewGame,
        addRound,
        endGame,
        loadGame,
        isLoading,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
