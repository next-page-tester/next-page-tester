import { Fragment } from 'react';
import type {
  NextPageContext,
  GetServerSidePropsContext,
  GetStaticPropsContext,
} from 'next';
import makeHttpObjects from './makeHttpObjects';
import type { OptionsWithDefaults, PageObject } from '../commonTypes';

export function makeGetInitialPropsContext({
  pageObject,
  options: { req: reqMocker, res: resMocker },
}: {
  pageObject: PageObject;
  options: OptionsWithDefaults;
}): NextPageContext {
  const { pagePath, params, route, query } = pageObject;
  const { req, res } = makeHttpObjects({ pageObject, reqMocker, resMocker });

  return {
    // @NOTE AppTree is currently just a stub
    AppTree: Fragment,
    req,
    res,
    err: undefined,
    pathname: pagePath,
    query: { ...params, ...query }, // GIP ctx query merges params and query together
    asPath: route,
  };
}

export function makeGetServerSidePropsContext({
  pageObject,
  options: { req: reqMocker, res: resMocker },
}: {
  pageObject: PageObject;
  options: OptionsWithDefaults;
}): GetServerSidePropsContext<typeof pageObject.params> {
  const { params, query } = pageObject;
  const { req, res } = makeHttpObjects({ pageObject, reqMocker, resMocker });

  // @TODO complete ctx object
  // https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering
  return {
    params: { ...params },
    query: { ...query },
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
