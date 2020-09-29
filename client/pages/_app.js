//Lirary imports
import { ThemeProvider } from 'styled-components';
import { ToastProvider } from 'react-toast-notifications';

// Component imports
import ToastNotification from '../components/ToastNotification';
import Header from '../components/Header';

// Api imports
import buildClient from './api/buildClient';

// Style imports
import GlobalStyle from '../styles/global';
import theme from '../styles/theme';

const MyApp = ({ Component, pageProps, currentUser }) => {
  return (
    <ThemeProvider theme={theme}>
      <ToastProvider
        components={{ Toast: ToastNotification }}
        placement="bottom-center"
        autoDismissTimeout="12000"
      >
        <Header currentUser={currentUser} />
        <Component {...pageProps} currentUser={currentUser} />
        <GlobalStyle />
      </ToastProvider>
    </ThemeProvider>
  );
};

MyApp.getInitialProps = async appContext => {
  const client = buildClient(appContext.ctx);
  const { data } = await client.get('/api/users/currentUser');

  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(
      appContext.ctx,
      client,
      data.currentUser,
    );
  }

  return { pageProps, ...data };
};

export default MyApp;
