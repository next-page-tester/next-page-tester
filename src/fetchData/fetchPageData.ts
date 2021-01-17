import type {
  NextPageContext,
  GetServerSidePropsContext,
  GetStaticPropsContext,
} from 'next';
import type { AppInitialProps } from 'next/app';
import {
  makeGetInitialPropsContext,
  makeGetServerSidePropsContext,
  makeStaticPropsContext,
} from './makeContextObject';
import {
  ExtendedOptions,
  PageObject,
  PageData,
  NextPageFile,
  RuntimeEnvironment,
} from '../commonTypes';
import type { CustomError } from '../commonTypes';
import { executeAsIfOnServer } from '../server';
import { InternalError } from '../_error/error';

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
    throw new InternalError('Only one data fetching method is allowed');
  }
}

// Pages' fetching methods may return "notFound" and "redirect" object
function ensurePageDataHasProps({
  pageData,
}: {
  pageData: { [key: string]: unknown };
}) {
  const allowedKeys = ['props', 'redirect'];
  for (const key of allowedKeys) {
    if (key in pageData) {
      return;
    }
  }

  const errorMessage = `[next-page-tester] Page's fetching method returned an object with unsupported fields. Supported fields are: "[${allowedKeys.join(
    ', '
  )}]". Returned value is available in error.payload.`;
  const error: CustomError = new Error(errorMessage);
  error.payload = pageData;
  throw error;
}

function mergePageDataWithAppData({
  pageData,
  appInitialProps,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pageData: { [key: string]: any };
  appInitialProps?: AppInitialProps;
}) {
  const { props: pageProps, ...restOfPageData } = pageData;
  //appInitialProps.pageProps gets merged with pageData.props
  return {
    props: {
      ...appInitialProps?.pageProps,
      ...pageProps,
    },
    ...restOfPageData,
  };
}

/*
 * fetchPageData behaves differently depending on whether custom /_app
 * fetches data or not (appInitialProps)
 *
 * /_app HAS NOT fetched data:
 * fetch page data using the first available method:
 * - getInitialProps
 * - getServerSideProps
 * - getStaticProps
 *
 * /_app HAS fetched data:
 * DO NOT call getInitialProps, if available
 * If available, call getServerSideProps or getServerSideProps
 * and merge returned object's prop property with appInitialProps.pageProps
 *
 * If no fetching methods available, return appInitialProps.pageProps as {props: appInitialProps.pageProp}
 */
export default async function fetchPageData({
  pageObject,
  appInitialProps,
  options,
}: {
  pageObject: PageObject;
  appInitialProps?: AppInitialProps;
  options: ExtendedOptions;
}): Promise<PageData> {
  const { env } = options;
  const { page, params } = pageObject;
  ensureNoMultipleDataFetchingMethods({ page: page.server });

  const pageComponent = page[env].default;
  const { getInitialProps } = pageComponent;
  if (
    getInitialProps &&
    // getInitialProps is not called when custom App has the same method
    !appInitialProps
  ) {
    const ctx: NextPageContext = makeGetInitialPropsContext({
      options,
      pageObject,
    });

    if (env === RuntimeEnvironment.CLIENT) {
      const initialProps = await getInitialProps(ctx);
      return { props: initialProps };
    } else {
      const initialProps = await executeAsIfOnServer(() =>
        getInitialProps(ctx)
      );
      return { props: initialProps };
    }
  }

  if (page.server.getServerSideProps) {
    const { getServerSideProps } = page.server;
    const ctx: GetServerSidePropsContext<
      typeof params
    > = makeGetServerSidePropsContext({ options, pageObject });
    const pageData = await executeAsIfOnServer(() => getServerSideProps(ctx));
    ensurePageDataHasProps({ pageData });
    return mergePageDataWithAppData({ pageData, appInitialProps });
  }

  if (page.server.getStaticProps) {
    const ctx: GetStaticPropsContext<typeof params> = makeStaticPropsContext({
      pageObject,
    });
    // @TODO introduce `getStaticPaths` logic
    // https://nextjs.org/docs/basic-features/data-fetching#getstaticpaths-static-generation
    const pageData = await page.server.getStaticProps(ctx);
    ensurePageDataHasProps({ pageData });
    return mergePageDataWithAppData({ pageData, appInitialProps });
  }

  if (appInitialProps) {
    return { props: appInitialProps.pageProps };
  }

  return {};
}
