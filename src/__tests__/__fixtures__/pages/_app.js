import React from 'react';
import App from 'next/app';

export default function CustomApp({ Component, pageProps }) {
  return (
    <>
      '_app'
      <Component {...pageProps} />;
    </>
  );
}

CustomApp.getInitialProps = async (appContext) => {
  // calls page's `getInitialProps` and fills `appProps.pageProps`
  const appProps = await App.getInitialProps(appContext);
  return { ...appProps };
};
