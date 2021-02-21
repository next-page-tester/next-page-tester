import React from 'react';
import type { AppProps } from 'next/app';
import { Global, CacheProvider, css } from '@emotion/react';
import { cache } from '@emotion/css';

const MyApp = ({ Component, pageProps }: AppProps) => (
  <>
    <CacheProvider value={cache}>
      <Global
        styles={css`
          body {
            color: red;
          }
        `}
      />
      <Component {...pageProps} />
    </CacheProvider>
  </>
);

export default MyApp;
