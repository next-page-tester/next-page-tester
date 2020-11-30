import { getPage } from '../../index';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import path from 'path';
import userEvent from '@testing-library/user-event';

describe('real-world-example', () => {
  it('Should work as expected', async () => {
    const { page } = await getPage({
      nextRoot: path.join(__dirname, '__fixtures__'),
      route: '/?name=Matthew',
      useDocument: true,
    });

    const { container } = render(page);

    const head = container.querySelector('head') as HTMLHeadElement;
    const html = container.querySelector('html') as HTMLHtmlElement;

    expect(html).toHaveAttribute('lang', 'en');
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

    const backToRootLink = await screen.findByText('Back to root');

    // TODO: something like this should work
    // screen.getByText('Came from http://localhost:3000/');

    // Make sure head title is updated with the new page
    expect(head.querySelector('title')?.textContent).toEqual('Page A');

    userEvent.click(backToRootLink);

    await screen.findByText('Count: 0');
  });
});
