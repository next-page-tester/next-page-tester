import { getPage } from '../../index';
import { render, screen } from '@testing-library/react';
import path from 'path';
import userEvent from '@testing-library/user-event';

describe('real-world-example', () => {
  it('Should correctly render _document and work with client side interactions', async () => {
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
    screen.getByText('Hello Matthew');
    screen.getByText('Count: 0');

    // Make sure that click handlers work
    userEvent.click(screen.getByText('Click me'));
    screen.getByText('Count: 1');

    // Make sure cleint navigation work
    userEvent.click(screen.getByText('To page A'));

    await screen.findByText('Came from http://localhost/?name=Matthew');

    // Make sure head title is updated with the new page
    expect(head.querySelector('title')?.textContent).toEqual('Page A');

    screen.getByText('Count: 0');
    userEvent.click(screen.getByText('Click me'));
    screen.getByText('Count: 1');

    userEvent.click(screen.getByText('Back to root'));
    await screen.findByText('Count: 0');
  });
});
