import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import path from 'path';
import * as api from './__fixtures__/api';
import { getPage } from '../../../src';

const nextRoot = path.join(__dirname, '__fixtures__');

describe('non-isolated-modules', () => {
  test('as a user I want to mock a module in client & server environment', async () => {
    const stub = jest
      .spyOn(api, 'getData')
      .mockReturnValueOnce(Promise.resolve('mocked-server-data'))
      .mockReturnValueOnce(Promise.resolve('mocked-client-data'));

    const { render } = await getPage({
      route: '/page',
      nextRoot,
      nonIsolatedModules: [path.join(nextRoot, 'api')],
    });

    expect(stub).toHaveBeenCalledTimes(1);

    render();
    await screen.findByText('mocked-server-data');

    userEvent.click(screen.getByText('Change data'));
    await screen.findByText('mocked-client-data');

    expect(stub).toHaveBeenCalledTimes(2);
  });
});
