import React from 'react';
import { getPage } from '../..';
import { expectDOMElementsToMatch, renderWithinNextRoot } from '../__utils__';
import BlogPage from './__fixtures__/pages/blog/[id]';
import BlogPage99 from './__fixtures__/pages/blog/99';
import CatchAllPage from './__fixtures__/pages/[...catchAll]';

const nextRoot = __dirname + '/__fixtures__';

describe('Routing in presence of top level catch all', () => {
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

  it('gets expected page and router object', async () => {
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

describe('Top level catch all', () => {
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
            query: { catchAll: ['catch-all', '5', 'aaa'] },
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
              catchAll: ['catch-all', '5', 'aaa', 'bbb', 'ccc'],
              foo: 'bar',
            },
          }}
        />
      );

      expectDOMElementsToMatch(actual, expected);
    });
  });
});
