import React from 'react';
import { getPage } from '../../../src';
import path from 'path';
import { screen } from '@testing-library/react';
import { MockedProvider } from './__fixtures__/MockedProvider';
import { silenceConsoleError } from '../__utils__';

silenceConsoleError('Text content did not match.');

const renderMethods = ['serverRender', 'render'] as const;

describe('wrapper', () => {
  describe('.Page', () => {
    renderMethods.forEach((_renderMethod) => {
      describe(_renderMethod, () => {
        it('wraps page component with provided Page enhancer', async () => {
          const source = 'Page wrapper';
          const { [_renderMethod]: renderMethod } = await getPage({
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

          renderMethod();
          expect(screen.getByText(`Source: ${source}`)).toBeInTheDocument();
        });
      });
    });
  });

  describe('.App', () => {
    renderMethods.forEach((_renderMethod) => {
      describe(_renderMethod, () => {
        it('wraps app component with provided App enhancer', async () => {
          const source = 'App wrapper';
          const { [_renderMethod]: renderMethod } = await getPage({
            nextRoot: path.join(__dirname, '__fixtures__', 'App'),
            route: '/a',
            useApp: false,
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

          renderMethod();
          expect(screen.queryByText(`Source: ${source}`)).toBeInTheDocument();
        });
      });
    });
  });
});
