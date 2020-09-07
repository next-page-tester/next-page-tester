import React from 'react';
import queryString from 'query-string';
import httpMocks from 'node-mocks-http';
import { parseRoute } from './utils';

export default async function preparePage({
  pageObject: { page, params, route, req, res },
}) {
  if (page.getServerSideProps) {
    // @TODO complete ctx object
    // https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering
    const { search } = parseRoute({ route });
    const query = queryString.parse(search);
    const ctx = {
      params: { ...params },
      query,
      req: {
        ...httpMocks.createRequest({
          url: route,
          params: { ...params },
          query,
        }),
        ...req,
      },
      res: {
        ...httpMocks.createResponse(),
        ...res,
      },
    };
    const result = await page.getServerSideProps(ctx);
    return React.createElement(page.default, result.props);
  }

  if (page.getStaticProps) {
    // @TODO complete ctx object
    // https://nextjs.org/docs/basic-features/data-fetching#getstaticprops-static-generation
    const ctx = {
      params: { ...params },
    };
    // @TODO introduce `getStaticPaths` logic
    // https://nextjs.org/docs/basic-features/data-fetching#getstaticpaths-static-generation
    const result = await page.getStaticProps(ctx);
    return React.createElement(page.default, result.props);
  }

  return React.createElement(page.default);
}
