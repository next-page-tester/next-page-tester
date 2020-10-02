import { Fragment } from 'react';
import type {
  NextPageContext,
  GetServerSidePropsContext,
  GetStaticPropsContext,
} from 'next';
import makeHttpObjects from './makeHttpObjects';
import type {
  OptionsWithDefaults,
  PageObject,
  PageData,
  NextPageFile,
} from './commonTypes';

function ensureNoMultipleDataFetchingMethods({
  page,
}: {
  page: NextPageFile;
}): void {
  let methodsCounter = 0;
  if (page.getServerSideProps) {
    methodsCounter++;
  }
  if (page.getStaticProps) {
    methodsCounter++;
  }
  if (page.default.getInitialProps) {
    methodsCounter++;
  }
  if (methodsCounter > 1) {
    throw new Error(
      '[next page tester] only one data fetching method is allowed'
    );
  }
}

export default async function fetchData({
  pageObject,
  options,
}: {
  pageObject: PageObject;
  options: OptionsWithDefaults;
}): Promise<PageData> {
  const { page, pagePath, params, route, query } = pageObject;
  const { req: reqMocker, res: resMocker } = options;
  ensureNoMultipleDataFetchingMethods({ page });

  if (page.default.getInitialProps) {
    const { req, res } = makeHttpObjects({ pageObject, reqMocker, resMocker });
    const ctx: NextPageContext = {
      // @NOTE AppTree is currently just a stub
      AppTree: Fragment,
      req,
      res,
      err: undefined,
      pathname: pagePath,
      query: { ...params, ...query }, // GIP ctx query merges params and query together
      asPath: route,
    };

    const initialProps = await page.default.getInitialProps(ctx);
    return { props: initialProps };
  }

  if (page.getServerSideProps) {
    // @TODO complete ctx object
    // https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering
    const { req, res } = makeHttpObjects({ pageObject, reqMocker, resMocker });
    const ctx: GetServerSidePropsContext<typeof params> = {
      params: { ...params },
      query: { ...query },
      req,
      res,
    };

    return await page.getServerSideProps(ctx);
  }

  if (page.getStaticProps) {
    // @TODO complete ctx object
    // https://nextjs.org/docs/basic-features/data-fetching#getstaticprops-static-generation
    const ctx: GetStaticPropsContext<typeof params> = {
      params: { ...params },
    };
    // @TODO introduce `getStaticPaths` logic
    // https://nextjs.org/docs/basic-features/data-fetching#getstaticpaths-static-generation
    return await page.getStaticProps(ctx);
  }

  return {};
}
