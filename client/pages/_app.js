//Lirary imports
import App from 'next/app';
import { ThemeProvider } from 'styled-components';
import { ToastProvider } from 'react-toast-notifications';

// Component imports
import ToastNotification from '../components/ToastNotification';
import Header from '../components/Header';

// Api/Helpers imports
import buildClient from './api/buildClient';
import {
  checkForbiddenRoutesWithAuth,
  checkProtectedRoutes,
} from '../helpers/routesHelper';

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
  const { ctx } = appContext;
  const client = buildClient(ctx);
  const { data } = await client.get('/api/users/currentUser');

  checkProtectedRoutes(data.currentUser, ctx);
  checkForbiddenRoutesWithAuth(data.currentUser, ctx);

  const appProps = await App.getInitialProps(appContext);

  return { ...appProps, ...data };
};

export default MyApp;
