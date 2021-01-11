import type { CustomError } from '../../commonTypes';
import { getPage } from '../../index';
import * as SpecialReturnPage from './__fixtures__/pages/ssr/special-return';
import path from 'path';
import { InternalError } from '../../_error/error';

describe('Data fetching with special return types', () => {
  describe('page with notFound', () => {
    it('throws "missing prop field" error when "x" object is returned', async () => {
      const returnObject = await SpecialReturnPage.getServerSideProps();
      const expectedError: CustomError = new InternalError(
        `Page's fetching method returned an object with unsupported fields. Supported fields are: \"[props, redirect, notFound]\". Returned value is available in error.payload.`
      );
      expectedError.payload = returnObject;

      await expect(
        getPage({
          nextRoot: path.join(__dirname, '__fixtures__'),
          route: '/ssr/special-return',
        })
      ).rejects.toThrow(expectedError);
    });
  });
});
