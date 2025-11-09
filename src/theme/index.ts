import { DefaultTheme, MD3DarkTheme } from 'react-native-paper';

export const lightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#2E7D32',
    secondary: '#1565C0',
    background: '#F5F5F5',
    surface: '#FFFFFF',
    error: '#D32F2F',
    success: '#388E3C',
  },
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#FFA726',
    secondary: '#42A5F5',
    background: '#121212',
    surface: '#6366F1',
    error: '#EF5350',
    success: '#66BB6A',
  },
};

//green- #97E577
//blue- #75E9F8
//orange- #FFA726
//creame- #FFF3E0
//light green- #C8E6C9