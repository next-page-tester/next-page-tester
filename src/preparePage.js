import React from 'react';
import queryString from 'query-string';

export default async function preparePage({
  pageObject: { page, params, route },
}) {
  let props = {};

  if (page.getServerSideProps) {
    // @TODO complete ctx object
    // https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering
    const ctx = {
      query: queryString.parse(new URL(route).search),
      params: { ...params },
    };
    const result = await page.getServerSideProps(ctx);
    props = {
      ...result.props,
    };
  } else if (page.getStaticProps) {
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
    props = {
      ...result.props,
    };
  }

  return React.createElement(page.default, props);
}
