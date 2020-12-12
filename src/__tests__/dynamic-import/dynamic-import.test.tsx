import { getPage } from '../../index';
import { render, screen } from '@testing-library/react';
import path from 'path';

describe('Dynamic import', () => {
  it('renders as expected', async () => {
    const { page } = await getPage({
      nextRoot: path.join(__dirname, '__fixtures__'),
      route: '/page',
    });
    render(page);
    await screen.findByText('Hello component');
  });
});
