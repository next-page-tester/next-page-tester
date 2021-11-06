import { getPage } from '../../../src';
import { screen } from '@testing-library/react';
import path from 'path';
import userEvent from '@testing-library/user-event';

describe('req-redirect', () => {
  describe('Correctly handles _app redirects', () => {
    const nextRoot = path.join(__dirname, '__fixtures__', '__app');

    it('Server & client side', async () => {
      const { render } = await getPage({
        nextRoot,
        route: '/page-a?destination=/page-b',
      });

      render();
      expect(screen.getByText('Page B')).toBeInTheDocument();

      userEvent.click(screen.getByRole('link', { name: 'Link' }));

      await screen.findByText('Page C');
    });
  });

  describe('Correctly handles page redirects', () => {
    const nextRoot = path.join(__dirname, '__fixtures__', 'page');

    it('Server & client side', async () => {
      const { render } = await getPage({
        nextRoot,
        route: '/page-a',
      });

      render();
      expect(screen.getByText('Page B')).toBeInTheDocument();
    });
  });
});
