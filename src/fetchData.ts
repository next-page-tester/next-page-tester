import { Fragment } from 'react';
import type {
  NextPageContext,
  GetServerSidePropsContext,
  GetStaticPropsContext,
} from 'next';
import httpMocks from 'node-mocks-http';
import type {
  Options,
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
  pageObject: { page, pagePath, params, route, query },
  reqMocker,
  resMocker,
}: {
  pageObject: PageObject;
  reqMocker: Exclude<Options['req'], undefined>;
  resMocker: Exclude<Options['res'], undefined>;
}): Promise<PageData> {
  ensureNoMultipleDataFetchingMethods({ page });

  if (page.default.getInitialProps) {
    const req = httpMocks.createRequest({
      url: route,
      params: { ...params },
    });

    const ctx: NextPageContext = {
      // @NOTE AppTree is currently just a stub
      AppTree: Fragment,
      req: reqMocker(req),
      res: resMocker(httpMocks.createResponse()),
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
    const req = httpMocks.createRequest({
      url: route,
      params: { ...params },
    });

    const ctx: GetServerSidePropsContext<typeof params> = {
      params: { ...params },
      query: { ...query },
      req: reqMocker(req),
      res: resMocker(httpMocks.createResponse()),
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
}
