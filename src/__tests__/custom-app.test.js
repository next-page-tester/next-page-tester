import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { getPage } from '../index';
import CustomApp from './__fixtures__/pages/custom-app/[id]';
import CustomAppComponent from './__fixtures__/pages/_app';
const pagesDirectory = __dirname + '/__fixtures__/pages';

describe('custom App component', () => {
  it('wraps expected page with _app component', async () => {
    const actualPage = await getPage({
      pagesDirectory,
      route: '/custom-app/5',
      customApp: true,
    });
    const { container: actual } = render(actualPage);
    const { container: expected } = render(
      <CustomAppComponent
        Component={CustomApp}
        pageProps={{
          params: {
            id: '5',
          },
        }}
      />
    );
    expect(actual).toEqual(expected);
  });

  describe('route matching "_app" page', () => {
    it('returns undefined', async () => {
      const actualPage = await getPage({ pagesDirectory, route: '/_app' });
      expect(actualPage).toBe(undefined);
    });
  });
});
