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
import type {
  OptionsWithDefaults,
  PageObject,
  PageData,
  NextPageFile,
} from '../commonTypes';

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
  options: OptionsWithDefaults;
}): Promise<PageData> {
  const { page, params } = pageObject;
  ensureNoMultipleDataFetchingMethods({ page });

  // getInitialProps is not called when custom App has the same method
  if (page.default.getInitialProps && !appInitialProps) {
    const ctx: NextPageContext = makeGetInitialPropsContext({
      options,
      pageObject,
    });

    const initialProps = await page.default.getInitialProps(ctx);
    return { props: initialProps };
  }

  if (page.getServerSideProps) {
    const ctx: GetServerSidePropsContext<typeof params> = makeGetServerSidePropsContext(
      { options, pageObject }
    );
    const pageData = await page.getServerSideProps(ctx);
    const { props: pageProps, ...restOfPageData } = pageData;
    // App initial props gets merged with getServerSideProps props
    return {
      props: {
        ...appInitialProps?.pageProps,
        ...pageProps,
      },
      ...restOfPageData,
    };
  }

  if (page.getStaticProps) {
    const ctx: GetStaticPropsContext<typeof params> = makeStaticPropsContext({
      pageObject,
    });
    // @TODO introduce `getStaticPaths` logic
    // https://nextjs.org/docs/basic-features/data-fetching#getstaticpaths-static-generation
    return await page.getStaticProps(ctx);
  }

  if (appInitialProps) {
    return { props: appInitialProps.pageProps };
  }

  return {};
}
