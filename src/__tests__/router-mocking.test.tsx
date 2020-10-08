import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { getPage } from '../index';
import WithRouter from './__fixtures__/pages/with-router/[id]';
const pagesDirectory = __dirname + '/__fixtures__/pages';

describe('Router mocking', () => {
  describe('page using "useRouter"', () => {
    it('receives expected router object', async () => {
      const actualPage = await getPage({
        pagesDirectory,
        route: '/with-router/99?foo=bar#moo',
      });

      const { container: actual } = render(actualPage);
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
      const actualPage = await getPage({
        pagesDirectory,
        route: '/with-router/99',
        // @ts-ignore
        router: (router) => routerMock,
      });
      const { container: actual } = render(actualPage);
      const { container: expected } = render(
        <WithRouter routerMock={routerMock} />
      );
      expect(actual).toEqual(expected);
    });
  });
});
