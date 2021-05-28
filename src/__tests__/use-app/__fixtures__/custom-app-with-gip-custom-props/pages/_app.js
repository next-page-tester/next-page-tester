import React from 'react';
import App from 'next/app';

export default function CustomApp({ Component, pageProps, appCustomProps }) {
  return (
    <>
      _app
      <Component {...pageProps} />
      {appCustomProps && 'ok'}
    </>
  );
}

CustomApp.getInitialProps = async (appContext) => {
  const appProps = await App.getInitialProps(appContext);
  const appCustomProps = true;
  return { ...appProps, appCustomProps };
};
