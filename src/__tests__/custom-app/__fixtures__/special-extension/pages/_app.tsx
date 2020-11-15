import React from 'react';

export default function CustomApp({
  Component,
  pageProps,
}: {
  Component: React.ElementType;
  pageProps?: {};
}) {
  return (
    <>
      _app.jsx
      <Component {...pageProps} />;
    </>
  );
}
