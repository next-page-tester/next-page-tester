import React from 'react';
import { MockedProvider } from '../../MockedProvider';

export default function CustomApp({
  Component,
  pageProps,
}: {
  Component: React.ElementType;
  pageProps?: Record<string, unknown>;
}) {
  return (
    <MockedProvider.Provider value={{ source: 'App' }}>
      <Component {...pageProps} />
    </MockedProvider.Provider>
  );
}
