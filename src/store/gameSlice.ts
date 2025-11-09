import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Round {
  id: number;
  roundNumber: number;
  dealer: string;
  declarer: string;
  gameType: string;
  bidValue: number;
  gameValue: number;
  result: 'Won' | 'Lost';
  tricksWon: number | null;
  scoreChange: number;
  modifiers: {
    hand: boolean;
    ouvert: boolean;
    schneider: boolean;
    schwarz: boolean;
  };
}

interface GameState {
  players: string[];
  rounds: Round[];
  totals: Record<string, number>;
  currentDealer: number;
}

const initialState: GameState = {
  players: [],
  rounds: [],
  totals: {},
  currentDealer: 0,
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setPlayers: (state, action: PayloadAction<string[]>) => {
      state.players = action.payload;
      state.totals = {};
      action.payload.forEach(player => {
        state.totals[player] = 0;
      });
      AsyncStorage.setItem('@skat_players', JSON.stringify(action.payload));
      AsyncStorage.setItem('@skat_totals', JSON.stringify(state.totals));
    },
    addRound: (state, action: PayloadAction<Omit<Round, 'id' | 'roundNumber'>>) => {
      const round: Round = {
        ...action.payload,
        id: Date.now(),
        roundNumber: state.rounds.length + 1,
      };
      state.rounds.push(round);
      
      // Update totals
      if (round.result === 'Won') {
        state.totals[round.declarer] += round.gameValue;
      } else {
        state.totals[round.declarer] -= (round.gameValue * 2);
      }
      
      // Rotate dealer
      state.currentDealer = (state.currentDealer + 1) % state.players.length;
      
      AsyncStorage.setItem('@skat_rounds', JSON.stringify(state.rounds));
      AsyncStorage.setItem('@skat_totals', JSON.stringify(state.totals));
    },
    loadGameData: (state, action: PayloadAction<Partial<GameState>>) => {
      return { ...state, ...action.payload };
    },
    clearGameData: (state) => {
      AsyncStorage.multiRemove(['@skat_players', '@skat_rounds', '@skat_totals']);
      return initialState;
    },
    deleteLastRound: (state) => {
      const lastRound = state.rounds.pop();
      if (lastRound) {
        // Revert totals
        if (lastRound.result === 'Won') {
          state.totals[lastRound.declarer] -= lastRound.gameValue;
        } else {
          state.totals[lastRound.declarer] += (lastRound.gameValue * 2);
        }
        // Revert dealer
        state.currentDealer = (state.currentDealer - 1 + state.players.length) % state.players.length;
        
        AsyncStorage.setItem('@skat_rounds', JSON.stringify(state.rounds));
        AsyncStorage.setItem('@skat_totals', JSON.stringify(state.totals));
      }
    }
  },
});

export const { setPlayers, addRound, loadGameData, clearGameData, deleteLastRound } = gameSlice.actions;
export default gameSlice.reducer;