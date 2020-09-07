import React from 'react';
import getPage from '../getPage';
import IndexPage from './__fixtures__/pages/index';
import BlogIndexPage from './__fixtures__/pages/blog/index';
import BlogPage from './__fixtures__/pages/blog/[id]';
import BlogPage99 from './__fixtures__/pages/blog/99';
import SsrPage from './__fixtures__/pages/ssr/[id]';
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
    describe('routes exactly matching a dynamic page path', () => {
      it('gets expected page object', async () => {
        const actual = await getPage({
          pagesDirectory,
          route: '/blog/5',
        });
        expect(actual).toEqual(React.createElement(BlogPage));
      });

      it('supports aths with query strings', async () => {
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
  });

  describe('route with trailing slash', () => {
    it('returns undefined', async () => {
      const actual = await getPage({ pagesDirectory, route: '/blog/5/' });
      expect(actual).toBe(undefined);
    });
  });

  describe('page with getServerSideProps', () => {
    it('calls getServerSideProps before rendering', async () => {
      const actual = await getPage({ pagesDirectory, route: '/ssr/5?foo=bar' });
      expect(actual).toEqual(
        React.createElement(SsrPage, {
          query: { foo: 'bar' },
          params: { id: '5' },
        })
      );
    });
  });
});
