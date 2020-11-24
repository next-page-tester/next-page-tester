import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { getPage } from '../index';
import BlogPage from './__fixtures__/pages/blog/[id]';
import BlogPage99 from './__fixtures__/pages/blog/99';
import CatchAllPage from './__fixtures__/pages/catch-all/[id]/[...slug]';
import OptionalCatchAllPage from './__fixtures__/pages/optional-catch-all/[id]/[[...slug]]';
const nextRoot = __dirname + '/__fixtures__';

describe('Dynamic routes', () => {
  describe('Basic dynamic routes', () => {
    it('gets expected page object', async () => {
      const { page } = await getPage({
        nextRoot,
        route: '/blog/5',
      });
      const { container: actual } = render(page);
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
      const { page } = await getPage({
        nextRoot,
        route: '/blog/5?foo=bar',
      });
      const { container: actual } = render(page);
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
      const { page } = await getPage({
        nextRoot,
        route: '/blog/99',
      });
      const { container: actual } = render(page);
      const { container: expected } = render(<BlogPage99 />);
      expect(actual).toEqual(expected);
    });
  });

  describe('Catch all routes', () => {
    it('gets expected page object with params and querystring', async () => {
      const { page } = await getPage({
        nextRoot,
        route: '/catch-all/5/foo/bar/moo?foo=bar',
      });
      const { container: actual } = render(page);
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

    it('throws "page not found" error when no optional params are provided', async () => {
      await expect(
        getPage({
          nextRoot,
          route: '/catch-all/5',
        })
      ).rejects.toThrow(
        '[next page tester] No matching page found for given route'
      );
    });
  });

  describe('Optional catch all routes', () => {
    describe('Optional catch all routes', () => {
      it('gets expected page object with params and querystring', async () => {
        const { page } = await getPage({
          nextRoot,
          route: '/optional-catch-all/5/foo/bar/moo?foo=bar',
        });
        const { container: actual } = render(page);
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
        const { page } = await getPage({
          nextRoot,
          route: '/optional-catch-all/5',
        });
        const { container: actual } = render(page);
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
