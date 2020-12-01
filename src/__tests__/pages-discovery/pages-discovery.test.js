import React from 'react';
import path from 'path';
import { render } from '@testing-library/react';
import PageInNaturalRoot from '../../../pages/page';
import PageInRoot from './in-root/pages/page';
import PageInSrc from './in-src/src/pages/page';
import { getPage } from '../../index';

describe('Pages directory discovery + "nextRoot" option', () => {
  it('discover "pages" directory in auto-detected root', async () => {
    const { page } = await getPage({
      route: '/page',
    });

    const { container: actual } = render(page);
    const { container: expected } = render(<PageInNaturalRoot />);
    expect(actual).toEqual(expected);
  });

  describe('With "nextRoot" option', () => {
    it('discover "pages" directory in provided root', async () => {
      const nextRoot = path.join(__dirname, '/in-root');
      const { page } = await getPage({
        route: '/page',
        nextRoot,
      });

      const { container: actual } = render(page);
      const { container: expected } = render(<PageInRoot />);
      expect(actual).toEqual(expected);
    });

    it('discover "pages" directory in root/src', async () => {
      const nextRoot = path.join(__dirname, '/in-src');
      const { page } = await getPage({
        route: '/page',
        nextRoot,
      });

      const { container: actual } = render(page);
      const { container: expected } = render(<PageInSrc />);
      expect(actual).toEqual(expected);
    });

    describe('"pages" directory not found', () => {
      it('throws error', async () => {
        await expect(
          getPage({
            nextRoot: __dirname,
            route: '/page',
          })
        ).rejects.toThrow('[next page tester] Cannot find "pages" directory');
      });
    });
  });
});
