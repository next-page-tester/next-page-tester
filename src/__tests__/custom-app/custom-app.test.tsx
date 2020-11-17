import React, { Fragment } from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import httpMocks from 'node-mocks-http';
import { getPage } from '../../index';
import CustomAppWithGIP from './__fixtures__/custom-app-with-gip/pages/_app';
import CustomAppWithGIP_AppContextPage from './__fixtures__/custom-app-with-gip/pages/app-context';
import CustomAppWithGIP_SSRPage from './__fixtures__/custom-app-with-gip/pages/ssr';
import CustomAppWithGIP_SSGPage from './__fixtures__/custom-app-with-gip/pages/ssg';
import CustomAppWithGIP_GIPPage from './__fixtures__/custom-app-with-gip/pages/gip';

import CustomAppWithNextAppGIP from './__fixtures__/custom-app-with-next-app-gip/pages/_app';
import CustomAppWithNextAppGIP_GIP from './__fixtures__/custom-app-with-next-app-gip/pages/gip';

import SpecialExtensionCustomApp from './__fixtures__/special-extension/pages/_app';
import SpecialExtensionPage from './__fixtures__/special-extension/pages/page';
import MissingCustomAppPage from './__fixtures__/missing-custom-app/pages/page';

describe('Custom App component', () => {
  describe('with getInitialProps', () => {
    it('getInitialProps gets called with expected appContext', async () => {
      const actualPage = await getPage({
        nextRoot: __dirname + '/__fixtures__/custom-app-with-gip',
        route: '/app-context',
        useCustomApp: true,
      });
      const { container: actual } = render(actualPage);
      const expectedAppContext = {
        AppTree: Fragment,
        Component: CustomAppWithGIP_AppContextPage,
        ctx: {
          req: httpMocks.createRequest({
            url: '/app-context',
            params: {},
            query: {},
          }),
          res: httpMocks.createResponse(),
          err: undefined,
          pathname: '/app-context',
          query: {},
          asPath: '/app-context',
        },
        router: {
          asPath: '/app-context',
          pathname: '/app-context',
          query: {},
          route: '/app-context',
          basePath: '',
        },
      };
      const { container: expected } = render(
        <CustomAppWithGIP
          Component={CustomAppWithGIP_AppContextPage}
          pageProps={{
            ctx: expectedAppContext,
          }}
        />
      );
      expect(actual).toEqual(expected);
    });

    it.each([
      ['getServerSideProps', '/ssr', CustomAppWithGIP_SSRPage],
      ['getStaticProps', '/ssg', CustomAppWithGIP_SSGPage],
    ])('Page with %s', async (dataFetchingType, route, PageComponent) => {
      const actualPage = await getPage({
        nextRoot: __dirname + '/__fixtures__/custom-app-with-gip',
        route,
        useCustomApp: true,
      });
      const { container: actual } = render(actualPage);
      const { container: expected } = render(
        <CustomAppWithGIP
          Component={PageComponent}
          pageProps={{
            fromCustomApp: true,
            propNameCollision: 'from-page',
            fromPage: true,
          }}
        />
      );

      expect(actual).toEqual(expected);
    });

    describe('Page with getInitialProps', () => {
      it('getInitialProps does not get called', async () => {
        const actualPage = await getPage({
          nextRoot: __dirname + '/__fixtures__/custom-app-with-gip',
          route: '/gip',
          useCustomApp: true,
        });
        const { container: actual } = render(actualPage);
        const { container: expected } = render(
          <CustomAppWithGIP
            Component={CustomAppWithGIP_GIPPage}
            pageProps={{
              fromCustomApp: true,
              propNameCollision: 'from-app',
            }}
          />
        );
        expect(actual).toEqual(expected);
      });
    });
  });

  describe("calling Next's App.getInitialProps", () => {
    describe('Page with getInitialProps', () => {
      it("App.getInitialProps is able to call page's getInitialProps", async () => {
        const actualPage = await getPage({
          nextRoot: __dirname + '/__fixtures__/custom-app-with-next-app-gip',
          route: '/gip',
          useCustomApp: true,
        });

        const { container: actual } = render(actualPage);
        const { container: expected } = render(
          <CustomAppWithNextAppGIP
            Component={CustomAppWithNextAppGIP_GIP}
            pageProps={{
              fromPage: true,
            }}
          />
        );
        expect(actual).toEqual(expected);
      });
    });
  });

  it('Loads custom app file with any extension defined in "next.config.js"', async () => {
    const actualPage = await getPage({
      nextRoot: __dirname + '/__fixtures__/special-extension',
      route: '/page',
      useCustomApp: true,
    });
    const { container: actual } = render(actualPage);
    const { container: expected } = render(
      <SpecialExtensionCustomApp Component={SpecialExtensionPage} />
    );
    expect(actual).toEqual(expected);
  });

  it('Return page as usual if no custom app file is found', async () => {
    const actualPage = await getPage({
      nextRoot: __dirname + '/__fixtures__/missing-custom-app',
      route: '/page',
      useCustomApp: true,
    });
    const { container: actual } = render(actualPage);
    const { container: expected } = render(<MissingCustomAppPage />);
    expect(actual).toEqual(expected);
  });

  describe('route matching "_app" page', () => {
    it('throws "page not found" error', async () => {
      await expect(
        getPage({
          nextRoot: __dirname + '/__fixtures__/custom-app-with-gip',
          route: '/_app',
          useCustomApp: true,
        })
      ).rejects.toThrow(
        '[next page tester] No matching page found for given route'
      );
    });
  });
});
