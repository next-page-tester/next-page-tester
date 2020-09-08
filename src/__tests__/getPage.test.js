import React from 'react';
import httpMocks from 'node-mocks-http';
import getPage from '../getPage';
import IndexPage from './__fixtures__/pages/index';
import BlogIndexPage from './__fixtures__/pages/blog/index';
import BlogPage from './__fixtures__/pages/blog/[id]';
import BlogPage99 from './__fixtures__/pages/blog/99';
import CatchAllPage from './__fixtures__/pages/catch-all/[id]/[...slug]';
import SSRPage from './__fixtures__/pages/ssr/[id]';
import SSGPage from './__fixtures__/pages/ssg/[id]';
const pagesDirectory = __dirname + '/__fixtures__/pages';

describe('getPage', () => {
  describe('route matching a page path', () => {
    it('gets expected component', async () => {
      const actual = await getPage({ pagesDirectory, route: '/index' });
      expect(actual).toEqual(React.createElement(IndexPage));
    });
  });

  describe('route not matching any page', () => {
    it('returns undefined', async () => {
      const actual = await getPage({
        pagesDirectory,
        route: '/blog/5/doesntexists',
      });
      expect(actual).toBe(undefined);
    });
  });

  describe('pages files named "index"', () => {
    it('routes them to the root of the directory', async () => {
      const actual = await getPage({ pagesDirectory, route: '/blog' });
      expect(actual).toEqual(React.createElement(BlogIndexPage));
    });
  });

  describe('dynamic route segments', () => {
    it('gets expected page object', async () => {
      const actual = await getPage({
        pagesDirectory,
        route: '/blog/5',
      });
      expect(actual).toEqual(React.createElement(BlogPage));
    });

    it('supports paths with query strings', async () => {
      const actual = await getPage({
        pagesDirectory,
        route: '/blog/5?foo=bar',
      });
      expect(actual).toEqual(React.createElement(BlogPage));
    });

    it('predefined routes take precedence over dynamic', async () => {
      const actual = await getPage({
        pagesDirectory,
        route: '/blog/99',
      });
      expect(actual).toEqual(React.createElement(BlogPage99, {}));
    });
  });

  //@TODO: test without getServerSideProps when router is supported
  describe.only('catch all routes', () => {
    it('gets expected page object', async () => {
      const actual = await getPage({
        pagesDirectory,
        route: '/catch-all/5/foo/bar/moo',
      });
      expect(actual).toEqual(
        React.createElement(CatchAllPage, {
          params: {
            id: '5',
            slug: ['foo', 'bar', 'moo'],
          },
        })
      );
    });

    // it('supports paths with query strings', async () => {
    //   const actual = await getPage({
    //     pagesDirectory,
    //     route: '/blog/5?foo=bar',
    //   });
    //   expect(actual).toEqual(React.createElement(BlogPage));
    // });

    // it('predefined routes take precedence over dynamic', async () => {
    //   const actual = await getPage({
    //     pagesDirectory,
    //     route: '/blog/99',
    //   });
    //   expect(actual).toEqual(React.createElement(BlogPage99, {}));
    // });
  });

  describe('route with trailing slash', () => {
    it('returns undefined', async () => {
      const actual = await getPage({ pagesDirectory, route: '/blog/5/' });
      expect(actual).toBe(undefined);
    });
  });

  describe('page with getServerSideProps', () => {
    it('feeds page component with returned props', async () => {
      const actual = await getPage({ pagesDirectory, route: '/ssr/5?foo=bar' });
      const expectedParams = { id: '5' };
      const expectedQuery = { foo: 'bar' };
      const expectedReq = httpMocks.createRequest({
        url: '/ssr/5?foo=bar',
        params: expectedParams,
        query: expectedQuery,
      });
      const expectedRes = httpMocks.createResponse();

      //@HACK here props property order counts
      expect(JSON.stringify(actual)).toEqual(
        JSON.stringify(
          React.createElement(SSRPage, {
            params: expectedParams,
            query: expectedQuery,
            req: expectedReq,
            res: expectedRes,
          })
        )
      );
    });
  });

  describe('page with getStaticProps', () => {
    it('feeds page component with returned props', async () => {
      const actual = await getPage({ pagesDirectory, route: '/ssg/5?foo=bar' });
      expect(actual).toEqual(
        React.createElement(SSGPage, {
          params: { id: '5' },
        })
      );
    });
  });
});
