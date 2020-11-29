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

    userEvent.click(screen.getByText('To page A'));

    // TODO: fix client side navigation when useDocument: true
    // await screen.findByText('Back to root');
  });
});
