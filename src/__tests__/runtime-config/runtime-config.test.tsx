import { getPage } from '../../index';
import { render, screen } from '@testing-library/react';

describe('runtime config', () => {
  it('retrieves the runtime config in the browser', async () => {
    const { page } = await getPage({
      nextRoot: __dirname + '/__fixtures__/public-runtime-config',
      route: `/`,
    });
    render(page);

    const { innerHTML } = await screen.getByTestId('runtime-config');

    expect(innerHTML).not.toBe('');
    expect(JSON.parse(innerHTML)).toEqual({
      serverRuntimeConfig: {},
      publicRuntimeConfig: { name: 'test-public-config' },
    });
  });

  it('retrieves the runtime config on the server', async () => {
    const { page } = await getPage({
      nextRoot: __dirname + '/__fixtures__/server-runtime-config',
      route: `/`,
    });
    render(page);

    const { innerHTML } = await screen.getByTestId('runtime-config');

    expect(innerHTML).not.toBe('');
    expect(JSON.parse(innerHTML)).toEqual({
      serverRuntimeConfig: { name: 'test-server-config' },
      publicRuntimeConfig: { name: 'test-public-config' },
    });
  });
});
