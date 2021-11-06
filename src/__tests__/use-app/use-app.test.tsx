import React, { Fragment } from 'react';
import httpMocks from 'node-mocks-http';
import { getPage } from '../../../src';
import { expectDOMElementsToMatch, renderWithinNextRoot } from '../__utils__';
import CustomAppWithGIP from './__fixtures__/custom-app-with-gip/pages/_app';
import CustomAppWithGIP_AppContextPage from './__fixtures__/custom-app-with-gip/pages/app-context';
import CustomAppWithGIP_SSRPage from './__fixtures__/custom-app-with-gip/pages/ssr';
import CustomAppWithGIP_SSGPage from './__fixtures__/custom-app-with-gip/pages/ssg';
import CustomAppWithGIP_GIPPage from './__fixtures__/custom-app-with-gip/pages/gip';
import CustomAppWithGIP_Page from './__fixtures__/custom-app-with-gip/pages/page';

import CustomAppWithGIPCustomProps from './__fixtures__/custom-app-with-gip-custom-props/pages/_app';
import CustomAppWithGIPCustomProps_GIPPage from './__fixtures__/custom-app-with-gip-custom-props/pages/gip';
import CustomAppWithGIPCustomProps_SSRPage from './__fixtures__/custom-app-with-gip-custom-props/pages/ssr';
import CustomAppWithGIPCustomProps_SSGPage from './__fixtures__/custom-app-with-gip-custom-props/pages/ssg';

import CustomAppWithNextAppGIP from './__fixtures__/custom-app-with-next-app-gip/pages/_app';
import CustomAppWithNextAppGIP_GIP from './__fixtures__/custom-app-with-next-app-gip/pages/gip';

import SpecialExtensionCustomApp from './__fixtures__/special-extension/pages/_app';
import SpecialExtensionPage from './__fixtures__/special-extension/pages/page';
import MissingCustomAppPage from './__fixtures__/missing-custom-app/pages/page';
import { screen } from '@testing-library/react';
import { APP_PATH } from '../../constants';

describe('_app support', () => {
  describe('_app with getInitialProps', () => {
    it('getInitialProps gets called with expected appContext', async () => {
      const { render } = await getPage({
        nextRoot: __dirname + '/__fixtures__/custom-app-with-gip',
        route: '/app-context',
      });
      const { nextRoot: actual } = render();

      const res = httpMocks.createResponse();
      // @ts-expect-error missing type
      res._eventsCount = 1;
      const expectedAppContext = {
        AppTree: Fragment,
        Component: CustomAppWithGIP_AppContextPage,
        ctx: {
          pathname: '/app-context',
          query: {},
          asPath: '/app-context',
          req: httpMocks.createRequest({
            url: '/app-context',
            params: {},
            query: {},
          }),
          res,
          err: undefined,
        },
        router: {
          basePath: '',
          pathname: '/app-context',
          route: '/app-context',
          asPath: '/app-context',
          query: {},
          events: {},
          isFallback: false,
          isLocaleDomain: false,
          isReady: true,
          isPreview: false,
        },
      };
      const { container: expected } = renderWithinNextRoot(
        <CustomAppWithGIP
          Component={CustomAppWithGIP_AppContextPage}
          pageProps={{
            ctx: expectedAppContext,
          }}
        />
      );
      expectDOMElementsToMatch(actual, expected);
    });

    it.each([
      ['getServerSideProps', '/ssr', CustomAppWithGIP_SSRPage],
      ['getStaticProps', '/ssg', CustomAppWithGIP_SSGPage],
    ])('Page with %s', async (dataFetchingType, route, PageComponent) => {
      const { render } = await getPage({
        nextRoot: __dirname + '/__fixtures__/custom-app-with-gip',
        route,
      });
      const { nextRoot: actual } = render();
      const { container: expected } = renderWithinNextRoot(
        <CustomAppWithGIP
          Component={PageComponent}
          pageProps={{
            fromCustomApp: true,
            propNameCollision: 'from-page',
            fromPage: true,
          }}
        />
      );

      expectDOMElementsToMatch(actual, expected);
    });

    describe('Page with getInitialProps', () => {
      it('getInitialProps does not get called', async () => {
        const { render } = await getPage({
          nextRoot: __dirname + '/__fixtures__/custom-app-with-gip',
          route: '/gip',
        });
        const { nextRoot: actual } = render();
        const { container: expected } = renderWithinNextRoot(
          <CustomAppWithGIP
            Component={CustomAppWithGIP_GIPPage}
            pageProps={{
              fromCustomApp: true,
              propNameCollision: 'from-app',
            }}
          />
        );
        expectDOMElementsToMatch(actual, expected);
      });
    });

    describe('Custom props', () => {
      it('are passed to App', async () => {
        const { render } = await getPage({
          nextRoot:
            __dirname + '/__fixtures__/custom-app-with-gip-custom-props',
          route: '/gip',
        });
        const { nextRoot: actual } = render();
        const { container: expected } = renderWithinNextRoot(
          <CustomAppWithGIPCustomProps
            Component={CustomAppWithGIPCustomProps_GIPPage}
            pageProps={{
              fromPage: true,
            }}
            appCustomProps={true}
          />
        );
        expectDOMElementsToMatch(actual, expected);
      });

      it.each([
        ['getServerSideProps', '/ssr', CustomAppWithGIPCustomProps_SSRPage],
        ['getStaticProps', '/ssg', CustomAppWithGIPCustomProps_SSGPage],
      ])('Page with %s', async (dataFetchingType, route, PageComponent) => {
        const { render } = await getPage({
          nextRoot:
            __dirname + '/__fixtures__/custom-app-with-gip-custom-props',
          route,
        });
        const { nextRoot: actual } = render();
        const { container: expected } = renderWithinNextRoot(
          <CustomAppWithGIPCustomProps
            Component={PageComponent}
            pageProps={{
              fromPage: true,
            }}
            appCustomProps={true}
          />
        );

        expectDOMElementsToMatch(actual, expected);
      });
    });
  });

  describe("calling Next's App.getInitialProps", () => {
    describe('Page with getInitialProps', () => {
      it("App.getInitialProps is able to call page's getInitialProps", async () => {
        const { render } = await getPage({
          nextRoot: __dirname + '/__fixtures__/custom-app-with-next-app-gip',
          route: '/gip',
        });

        const { nextRoot: actual } = render();
        const { container: expected } = renderWithinNextRoot(
          <CustomAppWithNextAppGIP
            Component={CustomAppWithNextAppGIP_GIP}
            pageProps={{
              fromPage: true,
            }}
          />
        );
        expectDOMElementsToMatch(actual, expected);
      });
    });
  });

  it('Loads custom app file with any extension defined in "next.config.js"', async () => {
    const { render } = await getPage({
      nextRoot: __dirname + '/__fixtures__/special-extension',
      route: '/page',
    });
    const { nextRoot: actual } = render();
    const { container: expected } = renderWithinNextRoot(
      <SpecialExtensionCustomApp Component={SpecialExtensionPage} />
    );
    expectDOMElementsToMatch(actual, expected);
  });

  it('Return page as usual if no custom app file is found', async () => {
    const { render } = await getPage({
      nextRoot: __dirname + '/__fixtures__/missing-custom-app',
      route: '/page',
    });
    const { nextRoot: actual } = render();
    const { container: expected } = renderWithinNextRoot(
      <MissingCustomAppPage />
    );
    expectDOMElementsToMatch(actual, expected);
  });

  describe('route matching "_app" page', () => {
    it('renders 404 page', async () => {
      const { render } = await getPage({
        nextRoot: __dirname + '/__fixtures__/custom-app-with-gip',
        route: APP_PATH,
      });

      render();
      expect(screen.getByText('404')).toBeInTheDocument();

      expect(
        screen.getByText('This page could not be found.')
      ).toBeInTheDocument();
    });
  });

  describe('"useApp" === false while _app component available', () => {
    it('does not render custom App nor receives props from it', async () => {
      const { render } = await getPage({
        nextRoot: __dirname + '/__fixtures__/custom-app-with-gip',
        route: '/page',
        useApp: false,
      });
      const { nextRoot: actual } = render();
      const { container: expected } = renderWithinNextRoot(
        <CustomAppWithGIP_Page />
      );
      expectDOMElementsToMatch(actual, expected);
    });
  });
});
