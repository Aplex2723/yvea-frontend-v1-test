import { createTheme } from '@mui/material/styles';
import { OverridedComponents } from './components';

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1B019B'
    },
    warning: {
      main: '#FFC107',
      50: '#FFFAEB',
      700: '#B54708',
      800: '#93370D'
    },
    text: {
      primary: '#000000',
      secondary: '#344054',
      disabled: '#B3B3B3'
    },
    error: {
      main: '#D92D20'
    },
    grey: {
      50: '#F9FAFB',
      100: '#F4F5F7',
      200: '#EAECF0',
      300: '#D0D5DD',
      500: '#667085',
      600: '#475467',
      700: '#344054',
      800: '#101828'
    },
    secondary: {
      main: '#1B019B',
      500: '#1B019B',
      50: '#1B019B'
    },
    success: {
      main: '#039855',
      200: '#D1FADF'
    },
    background: {
      default: '#fffefe',
      paper: '#FFFFFF'
    }
  },
  components: OverridedComponents
});

export default lightTheme;
