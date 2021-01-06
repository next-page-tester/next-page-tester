import { getPage } from '../../../index';
import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';

describe('styletron-react', () => {
  it('As a user I can test applications using "styletron-react"', async () => {
    // There are some warnings/errors due to server & client className missmatch
    // They don't seem to be a bug in "next-page-tester" but un-complete implementation of stylesheets in JSDOM
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});

    const { render } = await getPage({
      nextRoot: __dirname,
      route: '/a',
    });

    render();

    userEvent.click(screen.getByText('Go to page B'));
    expect(await screen.findByText('This is page B')).toHaveClass('af');
  });
});
