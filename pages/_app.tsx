import React from 'react';
import { CacheProvider } from '@emotion/react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { appWithTranslation } from 'next-i18next';
import createEmotionCache from '../utility/emotionCache';
import lightTheme from '../styles/theme/lightTheme';
import '../styles/globals.css';
import App, { AppContext, AppProps } from 'next/app';
import { Layout } from '@/components/layout';
import { persistStore } from 'redux-persist';
import { wrapper } from '@/store';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import TawkTo from '@/components/TalkTo';

const clientSideEmotionCache = createEmotionCache();

const MyApp = ({ ...rest }: AppProps) => {
  const { store, props } = wrapper.useWrappedStore(rest);
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const persist = persistStore(store);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persist}>
        <CacheProvider value={emotionCache}>
          <ThemeProvider theme={lightTheme}>
            <CssBaseline />
            <Layout>
              <Component {...pageProps} />
              <TawkTo />
            </Layout>
          </ThemeProvider>
        </CacheProvider>
      </PersistGate>
    </Provider>
  );
};

MyApp.getInitialProps = async (appContext: AppContext) => {
  const appProps = await App.getInitialProps(appContext);

  return { ...appProps };
};
export default appWithTranslation(MyApp);
