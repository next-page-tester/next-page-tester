import React, { Fragment } from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import httpMocks from 'node-mocks-http';
import { getPage } from '../../index';
import CustomAppSSRPage from './__fixtures__/pages/custom-app/ssr/[id]';
import CustomAppGIPPage from './__fixtures__/pages/custom-app/gip/[id]';
import CustomAppComponent from './__fixtures__/pages/_app';
import SpecialExtensionCustomApp from './__fixtures__/special-extension/_app.jsx';
import SpecialExtensionPage from './__fixtures__/special-extension/custom-app';
import MissingCustomAppPage from './__fixtures__/missing-custom-app/custom-app';
const pagesDirectory = __dirname + '/__fixtures__/pages';

describe('Custom App component', () => {
  describe("getInitialProps method calling Next's App.getInitialProps", () => {
    describe('Page with getServerSideProps', () => {
      it('wraps expected page with _app component', async () => {
        const actualPage = await getPage({
          pagesDirectory,
          route: '/custom-app/ssr/5',
          customApp: true,
        });
        const { container: actual } = render(actualPage);
        const { container: expected } = render(
          <CustomAppComponent
            Component={CustomAppSSRPage}
            pageProps={{
              params: {
                id: '5',
              },
            }}
          />
        );
        expect(actual).toEqual(expected);
      });
    });

    describe('Page with getInitialProps', () => {
      it("wraps expected page with _app component and calls pages' getInitialProps", async () => {
        const actualPage = await getPage({
          pagesDirectory,
          route: '/custom-app/gip/5?foo=bar',
          customApp: true,
        });
        const expectedParams = { id: '5' };
        const expectedQuery = { foo: 'bar' };

        const { container: actual } = render(actualPage);
        const expectedAppContext = {
          AppTree: Fragment,
          Component: CustomAppGIPPage,
          router: {
            route: '/custom-app/gip/5?foo=bar',
            pathname: '/custom-app/[id]',
            query: { ...expectedParams, ...expectedQuery },
            asPath: '/custom-app/gip/5?foo=bar',
            basePath: '',
            // events: undefined,
            // isFallback: false,
          },
          ctx: {
            req: httpMocks.createRequest({
              url: '/custom-app/gip/5?foo=bar',
              params: expectedParams,
              query: expectedQuery,
            }),
            res: httpMocks.createResponse(),
            err: undefined,
            pathname: '/custom-app/[id]',
            query: { ...expectedParams, ...expectedQuery },
            asPath: '/custom-app/5?foo=bar',
          },
        };

        const { container: expected } = render(
          <CustomAppComponent
            Component={CustomAppGIPPage}
            pageProps={expectedAppContext}
          />
        );
        expect(actual).not.toEqual(expected);
      });
    });
  });

  it('Loads custom app file with any extension defined by "pageExtensions" option', async () => {
    const actualPage = await getPage({
      pagesDirectory: __dirname + '/__fixtures__/special-extension',
      route: '/custom-app',
      customApp: true,
    });
    const { container: actual } = render(actualPage);
    const { container: expected } = render(
      <SpecialExtensionCustomApp Component={SpecialExtensionPage} />
    );
    expect(actual).toEqual(expected);
  });

  it('Return page as usual if no custom app file is found', async () => {
    const actualPage = await getPage({
      pagesDirectory: __dirname + '/__fixtures__/missing-custom-app',
      route: '/custom-app',
      customApp: true,
    });
    const { container: actual } = render(actualPage);
    const { container: expected } = render(<MissingCustomAppPage />);
    expect(actual).toEqual(expected);
  });

  describe('route matching "_app" page', () => {
    it('returns undefined', async () => {
      const actualPage = await getPage({
        pagesDirectory,
        route: '/_app',
        customApp: true,
      });
      expect(actualPage).toBe(undefined);
    });
  });
});
