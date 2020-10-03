import React from 'react';

export default function CustomApp({ Component, pageProps }) {
  return (
    <>
      '_app.jsx'
      <Component {...pageProps} />;
    </>
  );
}
