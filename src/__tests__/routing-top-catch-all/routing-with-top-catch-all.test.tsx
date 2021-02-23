import React from 'react';
import { getPage } from '../..';
import { expectDOMElementsToMatch, renderWithinNextRoot } from '../__utils__';
import BlogPage from './__fixtures__/pages/blog/[id]';
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
});

describe('Top level catch all', () => {
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
