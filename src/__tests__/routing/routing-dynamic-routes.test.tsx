import React from 'react';
import { getPage } from '../../index';
import { expectDOMElementsToMatch, renderWithinNextRoot } from '../__utils__';
import BlogPage from './__fixtures__/pages/blog/[id]';
import BlogPage99 from './__fixtures__/pages/blog/99';
import CatchAllPage from './__fixtures__/pages/catch-all/[id]/[...slug]';
import OptionalCatchAllPage from './__fixtures__/pages/optional-catch-all/[id]/[[...slug]]';

const nextRoot = __dirname + '/__fixtures__';

describe('Dynamic routes', () => {
  describe('Basic dynamic routes', () => {
    it('gets expected page object', async () => {
      const { render } = await getPage({
        nextRoot,
        route: '/blog/5',
      });
      const { nextRoot: actual } = render();
      const { container: expected } = renderWithinNextRoot(
        <BlogPage
          routerMock={{
            query: {
              id: '5',
            },
          }}
        />
      );
      expectDOMElementsToMatch(actual, expected);
    });

    it('gets expected page object with params and querystring', async () => {
      const { render } = await getPage({
        nextRoot,
        route: '/blog/5?foo=bar',
      });
      const { nextRoot: actual } = render();
      const { container: expected } = renderWithinNextRoot(
        <BlogPage
          routerMock={{
            query: {
              id: '5',
              foo: 'bar',
            },
          }}
        />
      );
      expectDOMElementsToMatch(actual, expected);
    });

    it('predefined routes take precedence over dynamic', async () => {
      const { render } = await getPage({
        nextRoot,
        route: '/blog/99',
      });
      const { nextRoot: actual } = render();
      const { container: expected } = renderWithinNextRoot(<BlogPage99 />);
      expectDOMElementsToMatch(actual, expected);
    });
  });

  describe('Catch all routes', () => {
    it('gets expected page object with params and querystring', async () => {
      const { render } = await getPage({
        nextRoot,
        route: '/catch-all/5/foo/bar/moo?foo=bar',
      });
      const { nextRoot: actual } = render();
      const { container: expected } = renderWithinNextRoot(
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
      expectDOMElementsToMatch(actual, expected);
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
        const { render } = await getPage({
          nextRoot,
          route: '/optional-catch-all/5/foo/bar/moo?foo=bar',
        });
        const { nextRoot: actual } = render();
        const { container: expected } = renderWithinNextRoot(
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
        expectDOMElementsToMatch(actual, expected);
      });

      it('matches when no optional params are provided', async () => {
        const { render } = await getPage({
          nextRoot,
          route: '/optional-catch-all/5',
        });
        const { nextRoot: actual } = render();
        const { container: expected } = renderWithinNextRoot(
          <OptionalCatchAllPage
            routerMock={{
              query: {
                id: '5',
              },
            }}
          />
        );
        expectDOMElementsToMatch(actual, expected);
      });
    });
  });
});
