import React from 'react';
import { getPage } from '../../../src';
import path from 'path';
import { screen } from '@testing-library/react';
import { MockedProvider } from './__fixtures__/MockedProvider';

describe('wrapper', () => {
  test('Should wrap with Page', async () => {
    const source = 'Page wrapper';
    const { render } = await getPage({
      nextRoot: path.join(__dirname, '__fixtures__', 'Page'),
      route: '/a',
      nonIsolatedModules: [
        path.join(
          process.cwd(),
          'src/__tests__/wrapper/__fixtures__/MockedProvider'
        ),
      ],
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
});
