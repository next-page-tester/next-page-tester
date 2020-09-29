import React from 'react';

export default function CustomApp({ Component, pageProps }) {
  return (
    <>
      '_app'
      <Component {...pageProps} />;
    </>
  );
}
