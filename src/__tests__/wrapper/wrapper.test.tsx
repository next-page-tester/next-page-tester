import React from 'react';
import { getPage } from '../../../src';
import path from 'path';
import { screen } from '@testing-library/react';
import { MockedProvider } from './__fixtures__/MockedProvider';
import { silenceConsoleError } from '../__utils__';

silenceConsoleError('Text content did not match.');

describe('wrapper', () => {
  test('Should wrap with Page', async () => {
    const source = 'Page wrapper';
    const { render } = await getPage({
      nextRoot: path.join(__dirname, '__fixtures__', 'Page'),
      route: '/a',
      wrapper: {
        Page: (Page) => (pageProps) => {
          return (
            <MockedProvider.Provider value={{ source }}>
              <Page {...pageProps} />
            </MockedProvider.Provider>
          );
        },
      },
    });

    render();

    expect(screen.getByText(`Source: ${source}`)).toBeInTheDocument();
  });

  test('accepts App enhancer', async () => {
    const source = 'App wrapper';
    const { render } = await getPage({
      nextRoot: path.join(__dirname, '__fixtures__', 'App'),
      route: '/a',
      wrapper: {
        App: (App) => (appProps) => {
          return (
            <MockedProvider.Provider value={{ source }}>
              <App {...appProps} />
            </MockedProvider.Provider>
          );
        },
      },
    });

    render();

    expect(screen.queryByText(`Source: ${source}`)).toBeInTheDocument();
  });
});
