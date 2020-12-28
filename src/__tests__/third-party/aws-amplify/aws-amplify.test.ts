import { getPage } from '../../../index';
import { render, screen } from '@testing-library/react';

describe('aws-amplify', () => {
  it('should work on server', async () => {
    const error = jest.spyOn(console, 'error').mockImplementationOnce(() => {});

    const { page } = await getPage({
      nextRoot: __dirname,
      route: '/a',
    });

    render(page);
    await screen.findByText('The user is not authenticated');

    expect(error).toHaveBeenCalledWith(
      expect.stringMatching(/Error: Amplify has not been configured correctly./)
    );
    error.mockRestore();
  });
});
