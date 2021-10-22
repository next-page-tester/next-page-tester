import { getPage } from '../../../../../src';
import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import path from 'path';
import { mocks } from './pageWrapper';

describe('@apollo/client', () => {
  it('As a user I can test applications using "@apollo/client"', async () => {
    const { render } = await getPage({
      nextRoot: path.join(__dirname, '__fixtures__'),
      route: '/',
      wrapper: {
        Page: path.resolve(__dirname, 'pageWrapper'),
      },
    });

    render();

    expect(screen.getByText('Loading')).toBeInTheDocument();

    userEvent.click(
      await screen.findByText(mocks[0].result.data.allPosts[0].title)
    );

    await screen.findByText('PostBPage');
  });
});
