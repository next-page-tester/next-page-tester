import React from 'react';
import type { NextPage } from 'next';
import type { PageProps } from '../commonTypes';
import type { AppContext, AppInitialProps } from 'next/app';

type Props = {
  Component: NextPage;
  pageProps: PageProps | undefined;
};

/* TODO: we should be using DefaultApp from next/app as it has some custom logic */
const DefaultApp: React.FC<Props> & {
  getInitialProps?: (appContext: AppContext) => Promise<AppInitialProps>;
} = function DefaultApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
};

export default DefaultApp;
