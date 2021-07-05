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

    // @NOTE next/image renders multiple img elements
    const localImage = screen.getAllByTitle('Local image');
    const remoteImage = screen.getAllByTitle('Remote image');

    expect(localImage.length).toBeGreaterThan(0);
    expect(remoteImage.length).toBeGreaterThan(0);
  });
});
