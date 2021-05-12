import React from 'react';

export default function CustomApp({
  Component,
  pageProps,
}: {
  Component: React.ElementType;
  pageProps?: Record<string, unknown>;
}) {
  return <Component {...pageProps} />;
}
