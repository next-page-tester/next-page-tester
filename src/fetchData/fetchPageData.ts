import type {
  NextPageContext,
  GetServerSidePropsContext,
  GetStaticPropsContext,
} from 'next';
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

export default async function fetchPageData({
  pageObject,
  options,
}: {
  pageObject: PageObject;
  options: OptionsWithDefaults;
}): Promise<PageData> {
  const { page, params } = pageObject;
  ensureNoMultipleDataFetchingMethods({ page });

  if (page.default.getInitialProps) {
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
    return await page.getServerSideProps(ctx);
  }

  if (page.getStaticProps) {
    const ctx: GetStaticPropsContext<typeof params> = makeStaticPropsContext({
      pageObject,
    });
    // @TODO introduce `getStaticPaths` logic
    // https://nextjs.org/docs/basic-features/data-fetching#getstaticpaths-static-generation
    return await page.getStaticProps(ctx);
  }

  return {};
}
