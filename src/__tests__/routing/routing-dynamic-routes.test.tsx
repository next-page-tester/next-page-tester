import React from 'react';
import { getPage } from '../../../src';
import { expectDOMElementsToMatch, renderWithinNextRoot } from '../__utils__';
import ParamPage from './__fixtures__/pages/param/[id]';
import ParamPage99 from './__fixtures__/pages/param/99';
import ParamPageWithDash from './__fixtures__/pages/param/with-dash/[param-with-dash]';
import CatchAllPage from './__fixtures__/pages/catch-all/[id]/[...slug]';
import OptionalCatchAllPage from './__fixtures__/pages/optional-catch-all/[id]/[[...slug]]';
import { expectToBeDefault404Page } from '../__utils__';

const nextRoot = __dirname + '/__fixtures__';

describe('Dynamic routes', () => {
  describe('Basic dynamic routes', () => {
    it('gets expected page object', async () => {
      const { render } = await getPage({
        nextRoot,
        route: '/param/5',
      });
      const { nextRoot: actual } = render();
      const { container: expected } = renderWithinNextRoot(
        <ParamPage
          routerMock={{
            query: {
              id: '5',
            },
          }}
        />
      );
      expectDOMElementsToMatch(actual, expected);
    });

    it('gets expected page and router object', async () => {
      const { render } = await getPage({
        nextRoot,
        route: '/param/5?foo=bar',
      });
      const { nextRoot: actual } = render();
      const { container: expected } = renderWithinNextRoot(
        <ParamPage
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
        route: '/param/99',
      });
      const { nextRoot: actual } = render();
      const { container: expected } = renderWithinNextRoot(<ParamPage99 />);
      expectDOMElementsToMatch(actual, expected);
    });

    it('handles param names with "-" (dash)', async () => {
      const { render } = await getPage({
        nextRoot,
        route: '/param/with-dash/bar',
      });
      const { nextRoot: actual } = render();
      const { container: expected } = renderWithinNextRoot(
        <ParamPageWithDash />
      );
      expectDOMElementsToMatch(actual, expected);
    });
  });

  describe('Catch all routes', () => {
    describe('single catch-all param', () => {
      it('gets expected page and router object', async () => {
        const { render } = await getPage({
          nextRoot,
          route: '/catch-all/5/aaa',
        });
        const { nextRoot: actual } = render();
        const { container: expected } = renderWithinNextRoot(
          <CatchAllPage
            routerMock={{
              query: {
                id: '5',
                slug: ['aaa'],
              },
            }}
          />
        );
        expectDOMElementsToMatch(actual, expected);
      });
    });

    describe('multiple catch-all params + querystring', () => {
      it('gets expected page and router object', async () => {
        const { render } = await getPage({
          nextRoot,
          route: '/catch-all/5/aaa/bbb/ccc?foo=bar',
        });
        const { nextRoot: actual } = render();
        const { container: expected } = renderWithinNextRoot(
          <CatchAllPage
            routerMock={{
              query: {
                id: '5',
                slug: ['aaa', 'bbb', 'ccc'],
                foo: 'bar',
              },
            }}
          />
        );
        expectDOMElementsToMatch(actual, expected);
      });
    });

    it('renders 404 page when no optional params are provided', async () => {
      const { serverRender } = await getPage({
        nextRoot,
        route: '/catch-all/5',
      });
      const { nextRoot: actual } = serverRender();
      expectToBeDefault404Page(actual);
    });
  });

  describe('Optional catch all routes', () => {
    describe('multiple catch-all params + querystring', () => {
      it('gets expected page and router object', async () => {
        const { render } = await getPage({
          nextRoot,
          route: '/optional-catch-all/5/aaa/bbb/ccc?foo=bar',
        });
        const { nextRoot: actual } = render();
        const { container: expected } = renderWithinNextRoot(
          <OptionalCatchAllPage
            routerMock={{
              query: {
                id: '5',
                slug: ['aaa', 'bbb', 'ccc'],
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
