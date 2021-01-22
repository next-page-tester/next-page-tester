import type { CustomError } from '../../commonTypes';
import { getPage } from '../../../src';
import * as UnsupportedSsrReturnPage from './__fixtures__/pages/ssr/unsupported-ssr-return';
import path from 'path';

describe('Data fetching with special return types', () => {
  describe('page with "x"', () => {
    it('throws "missing prop field" error when "x" object is returned', async () => {
      const returnObject = await UnsupportedSsrReturnPage.getServerSideProps();
      const expectedError: CustomError = new Error(
        `[next-page-tester] Page's fetching method returned an object with unsupported fields. Supported fields are: "[props, redirect, notFound]". Returned value is available in error.payload.`
      );
      expectedError.payload = returnObject;

      await expect(
        getPage({
          nextRoot: path.join(__dirname, '__fixtures__'),
          route: '/ssr/unsupported-ssr-return',
        })
      ).rejects.toThrow(expectedError);
    });
  });
});
