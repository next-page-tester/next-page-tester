import { getPage } from '../../index';
import { screen } from '@testing-library/react';
import path from 'path';
import userEvent from '@testing-library/user-event';

describe('real-world-example', () => {
  it('Should correctly render _document and work with client side interactions', async () => {
    const { render } = await getPage({
      nextRoot: path.join(__dirname, '__fixtures__'),
      route: '/?name=Matthew',
      useDocument: true,
    });
    render();

    const html = document.documentElement;
    expect(html).toHaveAttribute('lang', 'en');

    const head = document.head;
    expect(head.querySelector('meta[name="Description"]')).toHaveAttribute(
      'Content',
      'Custom document description'
    );

    expect(head.querySelector('title')?.textContent).toEqual('Create Next App');

    // Correctly passes query
    expect(screen.getByText('Hello Matthew')).toBeInTheDocument();

    expect(screen.getByText('Count: 0')).toBeInTheDocument();

    // Make sure that click handlers work
    userEvent.click(screen.getByText('Click me'));
    expect(screen.getByText('Count: 1')).toBeInTheDocument();

    // Make sure cleint navigation work
    userEvent.click(screen.getByText('To page A'));

    const formSubmitButton = await screen.findByText('Submit form');

    await userEvent.type(
      screen.getByPlaceholderText('Email'),
      'john.doe@gmail.com'
    );

    userEvent.click(formSubmitButton);
    await screen.findByText('Got values: {"email":"john.doe@gmail.com"}');

    screen.getByText('Came from http://localhost/?name=Matthew');

    // Make sure head title is updated with the new page
    expect(head.querySelector('title')?.textContent).toEqual('Page A');

    userEvent.click(screen.getByText('Back to root'));

    await screen.findByText('Count: 0');
  });
});
