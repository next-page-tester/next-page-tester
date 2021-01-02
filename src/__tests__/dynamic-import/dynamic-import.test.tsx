import { getPage } from '../../index';
import { findByText } from '@testing-library/react';
import path from 'path';

describe('Dynamic import', () => {
  it('renders as expected when client page mounts', async () => {
    const { render } = await getPage({
      nextRoot: path.join(__dirname, '__fixtures__'),
      route: '/page',
    });
    render();
    await findByText(document.body, 'Hello component');
  });
});
