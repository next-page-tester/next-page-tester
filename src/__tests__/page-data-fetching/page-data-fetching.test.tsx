import React, { Fragment } from 'react';
import httpMocks from 'node-mocks-http';
import { getPage } from '../../index';
import { expectDOMElementsToMatch, renderWithinNextRoot } from '../__utils__';
import SSRPage from './__fixtures__/pages/ssr/[id]';
import SSGPage from './__fixtures__/pages/ssg/[id]';
import GIPPage from './__fixtures__/pages/gip/[id]';
const nextRoot = __dirname + '/__fixtures__';

describe('Data fetching', () => {
  describe('page with getInitialProps', () => {
    it('feeds page component with returned props', async () => {
      const { render } = await getPage({
        nextRoot,
        route: '/gip/5?foo=bar',
      });

      const expectedParams = { id: '5' };
      const expectedQuery = { foo: 'bar' };

      const { nextRoot: actual } = render();
      const expectedContext = {
        pathname: '/gip/[id]',
        query: { ...expectedParams, ...expectedQuery },
        asPath: '/gip/5?foo=bar',
        AppTree: Fragment,
        req: httpMocks.createRequest({
          url: '/gip/5?foo=bar',
          params: expectedParams,
          query: expectedQuery,
        }),
        res: httpMocks.createResponse(),
        err: undefined,
      };

      const { container: expected } = renderWithinNextRoot(
        <GIPPage {...expectedContext} />
      );
      expectDOMElementsToMatch(actual, expected);
    });
  });

  describe('page with getServerSideProps', () => {
    it('feeds page component with returned props', async () => {
      const { render } = await getPage({
        nextRoot,
        route: '/ssr/5?foo=bar',
      });

      const expectedParams = { id: '5' };
      const expectedQuery = { foo: 'bar' };

      const { nextRoot: actual } = render();
      const expectedProps = {
        params: expectedParams,
        query: expectedQuery,
        resolvedUrl: '/ssr/5?id=5&foo=bar',
        req: httpMocks.createRequest({
          url: '/ssr/5?foo=bar',
          params: expectedParams,
          query: expectedQuery,
        }),
        res: httpMocks.createResponse(),
      };
      const { container: expected } = renderWithinNextRoot(
        <SSRPage {...expectedProps} />
      );
      expectDOMElementsToMatch(actual, expected);
    });
  });

  describe('page with getStaticProps', () => {
    it('feeds page component with returned props', async () => {
      const { render } = await getPage({
        nextRoot,
        route: '/ssg/5?foo=bar',
      });
      const { nextRoot: actual } = render();
      const { container: expected } = renderWithinNextRoot(
        <SSGPage
          params={{
            id: '5',
          }}
        />
      );
      expectDOMElementsToMatch(actual, expected);
    });
  });

  describe('page with more than 1 data fetching method', () => {
    it('throws error', async () => {
      await expect(
        getPage({
          nextRoot,
          route: '/multiple-data-fetching',
        })
      ).rejects.toThrow(
        '[next page tester] Only one data fetching method is allowed'
      );
    });
  });
});
