import type { CustomError } from '../commonTypes';
import { getPage } from '../index';
import * as RedirectPage from './__fixtures__/pages/ssr/redirect';
import * as NotFoundPage from './__fixtures__/pages/ssr/not-found';
const nextRoot = __dirname + '/__fixtures__';

describe('Data fetching with special return types', () => {
  describe('page with notFound', () => {
    it('throws "missing prop field" error when redirect object is returned', async () => {
      const returnObject = await NotFoundPage.getServerSideProps();
      const expectedError: CustomError = new Error(
        `[next page tester] Page's fetching method returned an object with missing "props" field. Returned value is available in error.payload.`
      );
      expectedError.payload = returnObject;

      await expect(
        getPage({
          nextRoot,
          route: '/ssr/not-found',
        })
      ).rejects.toThrow(expectedError);
    });

    it('throws "missing prop field" error when redirect object is returned', async () => {
      const returnObject = await RedirectPage.getServerSideProps();
      const expectedError: CustomError = new Error(
        `[next page tester] Page's fetching method returned an object with missing "props" field. Returned value is available in error.payload.`
      );
      expectedError.payload = returnObject;

      await expect(
        getPage({
          nextRoot,
          route: '/ssr/redirect',
        })
      ).rejects.toThrow(expectedError);
    });
  });
});
