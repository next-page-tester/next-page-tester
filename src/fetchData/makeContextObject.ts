import { Fragment } from 'react';
import type {
  NextPageContext,
  GetServerSidePropsContext,
  GetStaticPropsContext,
} from 'next';
import { parse } from 'cookie';
import makeHttpObjects from './makeHttpObjects';
import type { ExtendedOptions, PageObject } from '../commonTypes';

export function makeGetInitialPropsContext({
  pageObject,
  options: { req: reqMocker, res: resMocker, previousRoute, env },
}: {
  pageObject: PageObject;
  options: ExtendedOptions;
}): NextPageContext {
  const { pagePath, params, route, query } = pageObject;

  const ctx: NextPageContext = {
    // @NOTE AppTree is currently just a stub
    AppTree: Fragment,
    pathname: pagePath,
    query: { ...params, ...query }, // GIP ctx query merges params and query together
    asPath: route,
  };

  if (env === 'server') {
    const { req, res } = makeHttpObjects({
      pageObject,
      reqMocker,
      resMocker,
      refererRoute: previousRoute,
    });

    ctx.req = req;
    ctx.res = res;
  }

  return ctx;
}

export function makeGetServerSidePropsContext({
  pageObject,
  options: { req: reqMocker, res: resMocker, previousRoute },
}: {
  pageObject: PageObject;
  options: ExtendedOptions;
}): GetServerSidePropsContext<typeof pageObject.params> {
  const { params, query, resolvedUrl } = pageObject;
  const { req, res } = makeHttpObjects({
    pageObject,
    reqMocker,
    resMocker,
    refererRoute: previousRoute,
  });

  // parsed "cookies" are only available in "getServerSideProps" data fetching method
  // https://github.com/vercel/next.js/pull/19724/files#diff-f1cccfe490138be7dae0d63562f6a2834af92d21130e0ff10d6de7ad30613f6bR132
  if (req.headers.cookie) {
    req.cookies = parse(req.headers.cookie);
  }

  // @TODO complete ctx object
  // https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering
  return {
    params: { ...params },
    query: { ...query },
    resolvedUrl,
    req,
    res,
  };
}

export function makeStaticPropsContext({
  pageObject,
}: {
  pageObject: PageObject;
}): GetStaticPropsContext<typeof pageObject.params> {
  const { params } = pageObject;

  // @TODO complete ctx object
  // https://nextjs.org/docs/basic-features/data-fetching#getstaticprops-static-generation
  return {
    params: { ...params },
  };
}
