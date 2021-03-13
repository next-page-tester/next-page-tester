import { getPage } from '../../../src';
import path from 'path';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('i18n', () => {
  it('should corretly handle locales', async () => {
    const { render } = await getPage({
      route: '/',
      nextRoot: path.join(__dirname, '__fixtures__'),
    });
    render();

    expect(
      screen.getByText(
        JSON.stringify({
          locale: 'en-US',
          locales: ['en-US', 'fr', 'nl-NL'],
          defaultLocale: 'en-US',
        })
      )
    ).toBeInTheDocument();

    userEvent.click(screen.getByText('To /fr/another'));

    await screen.findByText('Another page');
    expect(
      screen.getByText(
        JSON.stringify({
          locale: 'fr',
          locales: ['en-US', 'fr', 'nl-NL'],
          defaultLocale: 'en-US',
        })
      )
    ).toBeInTheDocument();

    userEvent.click(screen.getByRole('button', { name: 'to /nl-NL/index' }));
    await screen.findByText('Index page');

    expect(
      screen.getByText(
        JSON.stringify({
          locale: 'nl-NL',
          locales: ['en-US', 'fr', 'nl-NL'],
          defaultLocale: 'en-US',
        })
      )
    ).toBeInTheDocument();
  });
});
