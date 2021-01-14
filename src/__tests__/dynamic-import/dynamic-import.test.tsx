import { getPage } from '../../../src';
import { screen } from '@testing-library/react';
import path from 'path';

describe('Dynamic import', () => {
  it('renders as expected when client page mounts', async () => {
    const { render } = await getPage({
      nextRoot: path.join(__dirname, '__fixtures__'),
      route: '/page',
    });
    render();
    await screen.findByText('Hello component');
  });
});
