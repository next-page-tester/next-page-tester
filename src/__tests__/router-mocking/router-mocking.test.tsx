import React from 'react';
import { render as TLRender } from '@testing-library/react';
import { getPage } from '../../index';
import WithRouter from './__fixtures__/pages/with-router/[id]';
import { expectDOMElementsToMatch, makeNextRootElement } from '../__utils__';

const nextRoot = __dirname + '/__fixtures__';

describe('Router mocking', () => {
  describe('page using "useRouter"', () => {
    it('receives expected router object', async () => {
      const { render } = await getPage({
        nextRoot,
        route: '/with-router/99?foo=bar#moo',
      });

      const { container: actual } = render();
      const { container: expected } = TLRender(
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
        />,
        { container: makeNextRootElement() }
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
      const { container: actual } = render();
      const { container: expected } = TLRender(
        <WithRouter routerMock={routerMock} />,
        { container: makeNextRootElement() }
      );
      expectDOMElementsToMatch(actual, expected);
    });
  });
});
