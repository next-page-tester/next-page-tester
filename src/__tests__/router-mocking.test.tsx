import React from 'react';
import { render } from '@testing-library/react';
import { getPage } from '../index';
import WithRouter from './__fixtures__/pages/with-router/[id]';

const nextRoot = __dirname + '/__fixtures__';

describe('Router mocking', () => {
  describe('page using "useRouter"', () => {
    it('receives expected router object', async () => {
      const { page } = await getPage({
        nextRoot,
        route: '/with-router/99?foo=bar#moo',
      });

      const { container: actual } = render(page);
      const { container: expected } = render(
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
      expect(actual).toEqual(expected);
    });
  });

  describe('router option', () => {
    it('page receives custom router object', async () => {
      const routerMock = {
        route: 'mocked',
      };
      const { page } = await getPage({
        nextRoot,
        route: '/with-router/99',
        // @ts-ignore
        router: (router) => routerMock,
      });
      const { container: actual } = render(page);
      const { container: expected } = render(
        <WithRouter routerMock={routerMock} />
      );
      expect(actual).toEqual(expected);
    });
  });
});
