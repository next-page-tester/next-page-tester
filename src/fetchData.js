import React from 'react';
import httpMocks from 'node-mocks-http';

export default async function fetchData({
  pageObject: { page, params, route },
  reqMocker,
  resMocker,
}) {
  if (page.getServerSideProps) {
    // @TODO complete ctx object
    // https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering
    const req = httpMocks.createRequest({
      url: route,
      params: { ...params },
    });

    const ctx = {
      params: { ...params },
      query: { ...req.query },
      req: reqMocker(req),
      res: resMocker(httpMocks.createResponse()),
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
