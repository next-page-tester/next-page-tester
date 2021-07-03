import { getPage } from '../..';
import { screen } from '@testing-library/react';
import path from 'path';

describe('next/image', () => {
  it('renders as expected', async () => {
    const { render } = await getPage({
      nextRoot: path.join(__dirname, '__fixtures__'),
      route: '/page',
    });
    render();

    const localImage = screen.getByTitle('Local image');
    const remoteImage = screen.getByTitle('Remote image');

    expect(localImage).toBeInTheDocument();
    expect(remoteImage).toBeInTheDocument();
  });
});
