import React from 'react';
import { MockedProvider } from './MockedProvider';
import type { PageWrapper } from '../../../index';

export const pageContextValue = 'value-provided-from-page-wrapper';

const pageWrapper: PageWrapper = (Page) => (pageProps) => (
  <MockedProvider.Provider value={{ source: pageContextValue }}>
    <Page {...pageProps} />
  </MockedProvider.Provider>
);

export default pageWrapper;
