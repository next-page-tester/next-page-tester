import React from 'react';
import { MockedProvider } from '../MockedProvider';
import type { PageWrapper } from '../../../../index';

export const pageContextValue = 'value-provided-from-page-wrapper';
export const Page: PageWrapper = (Page) => (pageProps) => (
  <MockedProvider.Provider value={{ source: pageContextValue }}>
    <Page {...pageProps} />
  </MockedProvider.Provider>
);
