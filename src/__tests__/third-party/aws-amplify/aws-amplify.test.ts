import { getPage } from '../../../index';
import { screen } from '@testing-library/react';

describe('aws-amplify', () => {
  it('As a user I can test applications using "aws-amplify"', async () => {
    const error = jest.spyOn(console, 'error').mockImplementationOnce(() => {});
    const { render } = await getPage({
      nextRoot: __dirname,
      route: '/a',
    });

    render();
    screen.findByText('The user is not authenticated');

    expect(error).toHaveBeenCalledWith(
      expect.stringMatching(/Error: Amplify has not been configured correctly./)
    );
    error.mockRestore();
  });
});
