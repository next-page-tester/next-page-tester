import { getPage } from '../../index';
import { render, screen } from '@testing-library/react';
import path from 'path';
import userEvent from '@testing-library/user-event';

describe('cookies', () => {
  describe('with-ssr', () => {
    it('Should be able to access authenticated page by client side login with setting cookies', async () => {
      const { page } = await getPage({
        nextRoot: path.join(__dirname, '__fixtures__/with-ssr'),
        route: '/login',
        req: (req) => {
          req.headers.cookie = 'TrackingId=123;AnalyticsId=12345;Foo=Bar';
          return req;
        },
      });

      render(page);

      await screen.findByText(
        'Cookie: {"TrackingId":"123","AnalyticsId":"12345","Foo":"Bar"}'
      );

      userEvent.click(screen.getByText('Login'));

      await screen.findByText('Authenticated content');
      await screen.findByText(
        'Cookie: {"AnalyticsId":"12345","Foo":"Bar","SessionId":"super-secret"}'
      );

      userEvent.click(screen.getByText('To login'));
      await screen.findByText('Login');
      await screen.findByText(
        'Cookie: {"AnalyticsId":"12345","Foo":"Bar","SessionId":"super-secret"}'
      );
    });
  });
});
