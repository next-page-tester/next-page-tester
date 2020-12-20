import { getPage } from '../../index';
import { render, screen } from '@testing-library/react';

describe('runtime config', () => {
  it('retrieves the runtime config', async () => {
    const { page } = await getPage({
      nextRoot: __dirname + '/__fixtures__',
      route: `/`,
    });
    render(page);

    const { innerHTML } = await screen.getByTestId('runtime-config');

    expect(innerHTML).not.toBe('');
    expect(JSON.parse(innerHTML)).toMatchObject({
      serverRuntimeConfig: { name: 'test-server-config' },
      publicRuntimeConfig: { name: 'test-public-config' },
    });
  });
});
