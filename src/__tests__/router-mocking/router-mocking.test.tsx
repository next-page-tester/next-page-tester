import React from 'react';
import { getPage } from '../../../src';
import { expectDOMElementsToMatch, renderWithinNextRoot } from '../__utils__';
import WithRouter from './__fixtures__/pages/with-router/[id]';

const nextRoot = __dirname + '/__fixtures__';

describe('Router mocking', () => {
  describe('page using "useRouter"', () => {
    it('receives expected router object', async () => {
      const { render } = await getPage({
        nextRoot,
        route: '/with-router/99?foo=bar#moo',
      });

      const { nextRoot: actual } = render();
      const { container: expected } = renderWithinNextRoot(
        <WithRouter
          routerMock={{
            asPath: '/with-router/99?foo=bar#moo',
            pathname: '/with-router/[id]',
            query: {
              id: '99',
              foo: 'bar',
            },
            route: '/with-router/[id]',
            basePath: '',
          }}
        />
      );
      expectDOMElementsToMatch(actual, expected);
    });
  });

  describe('router option', () => {
    it('page receives custom router object', async () => {
      const routerMock = {
        route: 'mocked',
      };
      const { render } = await getPage({
        nextRoot,
        route: '/with-router/99',
        // @ts-ignore
        router: (router) => routerMock,
      });
      const { nextRoot: actual } = render();
      const { container: expected } = renderWithinNextRoot(
        <WithRouter routerMock={routerMock} />
      );
      expectDOMElementsToMatch(actual, expected);
    });
  });
});
