import React from 'react';
import { MockedProvider } from '../MockedProvider';
import type { AppWrapper } from '../../../../index';

export const appContextValue = 'value-provided-from-app-wrapper';
export const App: AppWrapper = (App) => (appProps) => (
  <MockedProvider.Provider value={{ source: appContextValue }}>
    <App {...appProps} />
  </MockedProvider.Provider>
);
