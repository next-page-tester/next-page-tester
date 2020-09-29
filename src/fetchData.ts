import httpMocks from 'node-mocks-http';
import type { Options, PageObject, PageData } from './commonTypes';

export default async function fetchData({
  pageObject: { page, params, route },
  reqMocker,
  resMocker,
}: {
  pageObject: PageObject;
  reqMocker: Exclude<Options['req'], undefined>;
  resMocker: Exclude<Options['res'], undefined>;
}): Promise<PageData> {
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

    // @ts-ignore: Types of property 'req' are incompatible
    return await page.getServerSideProps(ctx);
  }

  if (page.getStaticProps) {
    // @TODO complete ctx object
    // https://nextjs.org/docs/basic-features/data-fetching#getstaticprops-static-generation
    const ctx = {
      params: { ...params },
    };
    // @TODO introduce `getStaticPaths` logic
    // https://nextjs.org/docs/basic-features/data-fetching#getstaticpaths-static-generation
    return await page.getStaticProps(ctx);
  }
}
