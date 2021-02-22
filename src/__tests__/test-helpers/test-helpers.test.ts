import path from 'path';
import { screen } from '@testing-library/react';

describe('test-helpers', () => {
  describe('Should skip auto init test helpers', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let getPage: any;

    beforeAll(() => {
      process.env.NEXT_PAGE_TESTER_SKIP_AUTO_INIT_TEST_HELPERS = 'true';
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const npt = require('../../../src');
      getPage = npt.getPage;
    });

    test('first', async () => {
      const { render } = await getPage({
        route: '/',
        nextRoot: path.join(__dirname, '__fixtures__'),
      });
      render();
      await screen.findByText('Index Page');
    });

    test('second', async () => {
      await screen.findByText('Index Page');
    });
  });
});
