//Lirary imports
import { ThemeProvider } from 'styled-components';
import { ToastProvider } from 'react-toast-notifications';

// Component imports
import ToastNotification from '../components/ToastNotification';

// Style imports
import GlobalStyle from '../styles/global';
import theme from '../styles/theme';

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme}>
      <ToastProvider
        components={{ Toast: ToastNotification }}
        placement="bottom-center"
        autoDismissTimeout="12000"
      >
        <Component {...pageProps} />
        <GlobalStyle />
      </ToastProvider>
    </ThemeProvider>
  );
}

export default MyApp;
