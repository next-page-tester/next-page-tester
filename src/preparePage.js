import React from 'react';
import queryString from 'query-string';
import { parseRoute } from './utils';

export default async function preparePage({
  pageObject: { page, params, route },
}) {
  if (page.getServerSideProps) {
    // @TODO complete ctx object
    // https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering
    const ctx = {
      query: queryString.parse(parseRoute({ route }).search),
      params: { ...params },
    };
    const result = await page.getServerSideProps(ctx);
    return React.createElement(page.default, result.props);
  }

  if (page.getStaticProps) {
    // @TODO complete ctx object
    //https://nextjs.org/docs/basic-features/data-fetching#getstaticprops-static-generation
    const ctx = {};
    if (page.getStaticPaths) {
      const { paths } = await page.getStaticPaths();
      // @NOTE getStaticPaths returns an array of paths to statically render a set of pages
      // Here we only use and test the first returned path
      ctx.params = paths[0].params;
    }
    const result = await page.getStaticProps(ctx);
    return React.createElement(page.default, result.props);
  }

  return React.createElement(page.default);
}
