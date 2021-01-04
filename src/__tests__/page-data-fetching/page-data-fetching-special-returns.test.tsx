import { getPage } from '../../index';
import path from 'path';
import { render, screen } from '@testing-library/react';

describe('Data fetching with special return types', () => {
  describe('page with notFound', () => {
    it('throws "missing prop field" error when not-found object is returned', async () => {
      const { page } = await getPage({
        nextRoot: path.join(__dirname, '__fixtures__'),
        route: '/ssr/not-found',
      });

      render(page);
      expect(
        screen.getByText('This page could not be found.')
      ).toBeInTheDocument();
      expect(screen.getByText('404')).toBeInTheDocument();
    });
  });
});
