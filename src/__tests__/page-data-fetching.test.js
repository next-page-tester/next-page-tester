import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import httpMocks from 'node-mocks-http';
import { getPage } from '../index';
import SSRPage from './__fixtures__/pages/ssr/[id]';
import SSGPage from './__fixtures__/pages/ssg/[id]';
const pagesDirectory = __dirname + '/__fixtures__/pages';

describe('Data fetching', () => {
  describe('page with getServerSideProps', () => {
    it('feeds page component with returned props', async () => {
      const actualPage = await getPage({
        pagesDirectory,
        route: '/ssr/5?foo=bar',
      });

      const expectedParams = { id: '5' };
      const expectedQuery = { foo: 'bar' };

      const { container: actual } = render(actualPage);
      const { container: expected } = render(
        <SSRPage
          params={expectedParams}
          query={expectedQuery}
          req={httpMocks.createRequest({
            url: '/ssr/5?foo=bar',
            params: expectedParams,
            query: expectedQuery,
          })}
          res={httpMocks.createResponse()}
        />
      );

      expect(actual).toEqual(expected);
    });
  });

  describe('page with getStaticProps', () => {
    it('feeds page component with returned props', async () => {
      const actualPage = await getPage({
        pagesDirectory,
        route: '/ssg/5?foo=bar',
      });
      const { container: actual } = render(actualPage);
      const { container: expected } = render(
        <SSGPage
          params={{
            id: '5',
          }}
        />
      );
      expect(actual).toEqual(expected);
    });
  });
});
