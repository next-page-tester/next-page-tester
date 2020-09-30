import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { getPage } from '../index';
import BlogPage from './__fixtures__/pages/blog/[id]';
import BlogPage99 from './__fixtures__/pages/blog/99';
import CatchAllPage from './__fixtures__/pages/catch-all/[id]/[...slug]';
import OptionalCatchAllPage from './__fixtures__/pages/optional-catch-all/[id]/[[...slug]]';
const pagesDirectory = __dirname + '/__fixtures__/pages';

describe('Dynamic routes', () => {
  describe('Basic dynamic routes', () => {
    it('gets expected page object', async () => {
      const actualPage = await getPage({
        pagesDirectory,
        route: '/blog/5',
      });
      const { container: actual } = render(actualPage);
      const { container: expected } = render(
        <BlogPage
          routerMock={{
            query: {
              id: '5',
            },
          }}
        />
      );
      expect(actual).toEqual(expected);
    });

    it('gets expected page object with params and querystring', async () => {
      const actualPage = await getPage({
        pagesDirectory,
        route: '/blog/5?foo=bar',
      });
      const { container: actual } = render(actualPage);
      const { container: expected } = render(
        <BlogPage
          routerMock={{
            query: {
              id: '5',
              foo: 'bar',
            },
          }}
        />
      );
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

  describe('Catch all routes', () => {
    it('gets expected page object with params and querystring', async () => {
      const actualPage = await getPage({
        pagesDirectory,
        route: '/catch-all/5/foo/bar/moo?foo=bar',
      });
      const { container: actual } = render(actualPage);
      const { container: expected } = render(
        <CatchAllPage
          routerMock={{
            query: {
              id: '5',
              slug: ['foo', 'bar', 'moo'],
              foo: 'bar',
            },
          }}
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

  describe('Optional catch all routes', () => {
    describe('Optional catch all routes', () => {
      it('gets expected page object with params and querystring', async () => {
        const actualPage = await getPage({
          pagesDirectory,
          route: '/optional-catch-all/5/foo/bar/moo?foo=bar',
        });
        const { container: actual } = render(actualPage);
        const { container: expected } = render(
          <OptionalCatchAllPage
            routerMock={{
              query: {
                id: '5',
                slug: ['foo', 'bar', 'moo'],
                foo: 'bar',
              },
            }}
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
            routerMock={{
              query: {
                id: '5',
              },
            }}
          />
        );
        expect(actual).toEqual(expected);
      });
    });
  });
});
