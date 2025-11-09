import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SettingsState {
  sound: boolean;
  vibration: boolean;
  darkMode: boolean;
}

const initialState: SettingsState = {
  sound: true,
  vibration: true,
  darkMode: false,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    toggleSound: (state) => {
      state.sound = !state.sound;
    },
    toggleVibration: (state) => {
      state.vibration = !state.vibration;
    },
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
    },
    loadSettings: (state, action: PayloadAction<Partial<SettingsState>>) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { toggleSound, toggleVibration, toggleDarkMode, loadSettings } = settingsSlice.actions;
export default settingsSlice.reducer;
