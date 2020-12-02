import React from 'react';
import { NextApp } from '../commonTypes';

const DefaultApp: NextApp = function DefaultApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
};

export default DefaultApp;
