import type { CustomError } from '../../commonTypes';
import { getPage } from '../../index';
import * as NotFoundPage from './__fixtures__/pages/ssr/not-found';
import path from 'path';

describe('Data fetching with special return types', () => {
  describe('page with notFound', () => {
    it('throws "missing prop field" error when not-found object is returned', async () => {
      const returnObject = await NotFoundPage.getServerSideProps();
      const expectedError: CustomError = new Error(
        `[next page tester] Page's fetching method returned an object with unsupported fields. Supported fields are: \"[props, redirect]\". Returned value is available in error.payload.`
      );
      expectedError.payload = returnObject;

      await expect(
        getPage({
          nextRoot: path.join(__dirname, '__fixtures__'),
          route: '/ssr/not-found',
        })
      ).rejects.toThrow(expectedError);
    });
  });
});
