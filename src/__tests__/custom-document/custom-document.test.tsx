import React, { Fragment } from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import httpMocks from 'node-mocks-http';
import { getPage } from '../../index';
import CustomDocumentWithGIP_SSR from './__fixtures__/custom-document-with-gip/pages/ssr';
import CustomApp from './__fixtures__/custom-document-with-gip/pages/_app';

describe('Custom _document', () => {
  describe('with getInitialProps', () => {
    it('Should render app wrapped around page when useCustomDocument=false', async () => {
      const route = '/ssr';
      const { page } = await getPage({
        nextRoot: __dirname + '/__fixtures__/custom-document-with-gip',
        route,
        useDocument: false,
      });

      const expectedAppContext = {
        AppTree: Fragment,
        Component: CustomDocumentWithGIP_SSR,
        ctx: {
          req: httpMocks.createRequest({
            url: route,
            params: {},
            query: {},
          }),
          res: httpMocks.createResponse(),
          err: undefined,
          pathname: route,
          query: {},
          asPath: route,
        },
        router: {
          asPath: route,
          pathname: route,
          query: {},
          route: route,
          basePath: '',
        },
      };

      const { container: actual } = render(page);
      const { container: expected } = render(
        <CustomApp
          Component={CustomDocumentWithGIP_SSR}
          pageProps={{
            ctx: expectedAppContext,
            fromCustomApp: true,
            propNameCollision: 'from-page',
            fromPage: true,
          }}
        />
      );

      expect(actual).toEqual(expected);
    });

    describe('with custom app', () => {
      it('Custom document is wrapped arround custom app which is wrapped arround SSR page', async () => {
        const route = '/ssr';
        const { page } = await getPage({
          nextRoot: __dirname + '/__fixtures__/custom-document-with-gip',
          route,
          useDocument: true,
        });

        const { container } = render(page);
        const head = container.querySelector('head') as HTMLHeadElement;
        const html = container.querySelector('html') as HTMLHtmlElement;

        expect(html).toHaveAttribute('lang', 'en');
        expect(head.querySelector('meta[name="Description"]')).toHaveAttribute(
          'Content',
          'Custom description'
        );
        expect(
          head.querySelector('meta[name="application-name"]')
        ).toHaveAttribute('Content', 'My app');

        const actual = container.querySelector('#__next') as HTMLDivElement;
        actual.removeAttribute('id');

        const expectedAppContext = {
          AppTree: Fragment,
          Component: CustomDocumentWithGIP_SSR,
          ctx: {
            req: httpMocks.createRequest({
              url: route,
              params: {},
              query: {},
            }),
            res: httpMocks.createResponse(),
            err: undefined,
            pathname: route,
            query: {},
            asPath: route,
          },
          router: {
            asPath: route,
            pathname: route,
            query: {},
            route: route,
            basePath: '',
          },
        };

        const { container: expected } = render(
          <CustomApp
            Component={CustomDocumentWithGIP_SSR}
            pageProps={{
              ctx: expectedAppContext,
              fromCustomApp: true,
              propNameCollision: 'from-page',
              fromPage: true,
            }}
          />
        );

        expect(actual).toEqual(expected);
      });
    });
  });

  describe('with special extensions', () => {
    it('renders expected document component', async () => {
      const route = '/page';
      const { page } = await getPage({
        nextRoot: __dirname + '/__fixtures__/special-extension',
        route,
        useDocument: true,
      });

      const { container } = render(page, {
        container: document.createElement('html'),
      });

      const head = container.querySelector('head') as HTMLHeadElement;
      expect(head.querySelector('meta[name="Description"]')).toHaveAttribute(
        'Content',
        'Document with special extension'
      );
    });
  });
});
