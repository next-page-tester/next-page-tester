import { getPage } from '../../../../src';
import { screen } from '@testing-library/react';

describe.skip('aws-amplify', () => {
  it('should work on server', async () => {
    const error = jest.spyOn(console, 'error').mockImplementationOnce(() => {});
    const { render } = await getPage({
      nextRoot: __dirname,
      route: '/a',
    });

    render();
    await screen.findByText('The user is not authenticated');

    expect(error).toHaveBeenCalledWith(
      expect.stringMatching(/Error: Amplify has not been configured correctly./)
    );
    error.mockRestore();
  });
});
