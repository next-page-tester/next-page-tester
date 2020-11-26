import React from 'react';

export default function CustomApp({ Component, pageProps }) {
  return (
    <>
      _app
      <Component {...pageProps} />;
    </>
  );
}

CustomApp.getInitialProps = async (appContext) => {
  return {
    pageProps: {
      ctx: appContext,
      fromCustomApp: true,
      propNameCollision: 'from-app',
    },
  };
};
