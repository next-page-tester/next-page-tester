import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import httpMocks from 'node-mocks-http';
import getPage from '../getPage';
import IndexPage from './__fixtures__/pages/index';
import BlogIndexPage from './__fixtures__/pages/blog/index';
import BlogPage from './__fixtures__/pages/blog/[id]';
import BlogPage99 from './__fixtures__/pages/blog/99';
import CatchAllPage from './__fixtures__/pages/catch-all/[id]/[...slug]';
import OptionalCatchAllPage from './__fixtures__/pages/optional-catch-all/[id]/[[...slug]]';
import SSRPage from './__fixtures__/pages/ssr/[id]';
import SSGPage from './__fixtures__/pages/ssg/[id]';
import WithRouter from './__fixtures__/pages/with-router/[id]';
const pagesDirectory = __dirname + '/__fixtures__/pages';

describe('getPage', () => {
  describe('route matching a page path', () => {
    it('gets expected component', async () => {
      const actualPage = await getPage({ pagesDirectory, route: '/index' });
      const { container: actual } = render(actualPage);
      const { container: expected } = render(<IndexPage />);
      expect(actual).toEqual(expected);
    });
  });

  describe('route not matching any page', () => {
    it('returns undefined', async () => {
      const actualPage = await getPage({
        pagesDirectory,
        route: '/blog/5/doesntexists',
      });
      expect(actualPage).toBe(undefined);
    });
  });

  describe('route with trailing slash', () => {
    it('returns undefined', async () => {
      const actualPage = await getPage({ pagesDirectory, route: '/blog/5/' });
      expect(actualPage).toBe(undefined);
    });
  });

  describe('pages files named "index"', () => {
    it('routes them to the root of the directory', async () => {
      const actualPage = await getPage({ pagesDirectory, route: '/blog' });
      const { container: actual } = render(actualPage);
      const { container: expected } = render(<BlogIndexPage />);
      expect(actual).toEqual(expected);
    });
  });

  describe('dynamic route segments', () => {
    it('gets expected page object', async () => {
      const actualPage = await getPage({
        pagesDirectory,
        route: '/blog/5',
      });
      const { container: actual } = render(actualPage);
      const { container: expected } = render(<BlogPage />);
      expect(actual).toEqual(expected);
    });

    it('supports paths with query strings', async () => {
      const actualPage = await getPage({
        pagesDirectory,
        route: '/blog/5?foo=bar',
      });
      const { container: actual } = render(actualPage);
      const { container: expected } = render(<BlogPage />);
      expect(actual).toEqual(expected);
    });

    it('predefined routes take precedence over dynamic', async () => {
      const actualPage = await getPage({
        pagesDirectory,
        route: '/blog/99',
      });
      const { container: actual } = render(actualPage);
      const { container: expected } = render(<BlogPage99 />);
      expect(actual).toEqual(expected);
    });
  });

  //@TODO: test it without getServerSideProps when next/router is supported
  describe('catch all routes', () => {
    it('gets expected page object', async () => {
      const actualPage = await getPage({
        pagesDirectory,
        route: '/catch-all/5/foo/bar/moo',
      });
      const { container: actual } = render(actualPage);
      const { container: expected } = render(
        <CatchAllPage
          params={{
            id: '5',
            slug: ['foo', 'bar', 'moo'],
          }}
          query={{}}
        />
      );
      expect(actual).toEqual(expected);
    });

    it('supports paths with query strings', async () => {
      const actualPage = await getPage({
        pagesDirectory,
        route: '/catch-all/5/foo/bar/moo?foo=bar',
      });
      const { container: actual } = render(actualPage);
      const { container: expected } = render(
        <CatchAllPage
          params={{
            id: '5',
            slug: ['foo', 'bar', 'moo'],
          }}
          query={{ foo: 'bar' }}
        />
      );
      expect(actual).toEqual(expected);
    });

    it("doesn't match when no optional params are provided", async () => {
      const actualPage = await getPage({
        pagesDirectory,
        route: '/catch-all/5',
      });
      expect(actualPage).toBe(undefined);
    });
  });

  //@TODO: test it without getServerSideProps when next/router is supported
  describe('optional catch all routes', () => {
    it('gets expected page object', async () => {
      const actualPage = await getPage({
        pagesDirectory,
        route: '/optional-catch-all/5/foo/bar/moo',
      });
      const { container: actual } = render(actualPage);
      const { container: expected } = render(
        <OptionalCatchAllPage
          params={{
            id: '5',
            slug: ['foo', 'bar', 'moo'],
          }}
          query={{}}
        />
      );
      expect(actual).toEqual(expected);
    });

    it('supports paths with query strings', async () => {
      const actualPage = await getPage({
        pagesDirectory,
        route: '/optional-catch-all/5/foo/bar/moo?foo=bar',
      });
      const { container: actual } = render(actualPage);
      const { container: expected } = render(
        <OptionalCatchAllPage
          params={{
            id: '5',
            slug: ['foo', 'bar', 'moo'],
          }}
          query={{ foo: 'bar' }}
        />
      );
      expect(actual).toEqual(expected);
    });

    it('matches when no optional params are provided', async () => {
      const actualPage = await getPage({
        pagesDirectory,
        route: '/optional-catch-all/5',
      });
      const { container: actual } = render(actualPage);
      const { container: expected } = render(
        <OptionalCatchAllPage
          params={{
            id: '5',
          }}
          query={{}}
        />
      );
      expect(actual).toEqual(expected);
    });
  });

  describe('page with getServerSideProps', () => {
    it('feeds page component with returned props', async () => {
      const actualPage = await getPage({
        pagesDirectory,
        route: '/ssr/5?foo=bar',
      });

      const expectedParams = { id: '5' };
      const expectedQuery = { foo: 'bar' };

      const { container: actual } = render(actualPage);
      const { container: expected } = render(
        <SSRPage
          params={expectedParams}
          query={expectedQuery}
          req={httpMocks.createRequest({
            url: '/ssr/5?foo=bar',
            params: expectedParams,
            query: expectedQuery,
          })}
          res={httpMocks.createResponse()}
        />
      );

      expect(actual).toEqual(expected);
    });
  });

  describe('page with getStaticProps', () => {
    it('feeds page component with returned props', async () => {
      const actualPage = await getPage({
        pagesDirectory,
        route: '/ssg/5?foo=bar',
      });
      const { container: actual } = render(actualPage);
      const { container: expected } = render(
        <SSGPage
          params={{
            id: '5',
          }}
        />
      );
      expect(actual).toEqual(expected);
    });
  });

  describe('with Next router', () => {
    it('receives expected router object', async () => {
      const actualPage = await getPage({
        pagesDirectory,
        route: '/with-router/99&foo=bar',
      });

      const { container: actual } = render(actualPage);
      const { container: expected } = render(
        <WithRouter
          routerMock={{
            asPath: '/with-router/99&foo=bar',
            pathname: '/with-router/[id]',
            query: {
              foo: 'bar',
              id: '99',
            },
            route: '/with-router/[id]',
          }}
        />
      );
      expect(actual).toEqual(expected);
    });
  });
});
