import React from 'react';
import type { AppProps } from 'next/dist/next-server/lib/router/router';
import Head from 'next/head';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>App title</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
