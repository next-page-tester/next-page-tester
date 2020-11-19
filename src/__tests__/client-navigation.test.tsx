import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { getPage } from '../index';
import PageB from './__fixtures__/pages/client-navigation-link/b';
const nextRoot = __dirname + '/__fixtures__';

describe('Client side navigation', () => {
  describe('using Link component', () => {
    it('navigates between pages', async () => {
      const Page = await getPage({
        nextRoot,
        route: '/client-navigation-link/a',
      });
      const screen = render(Page);
      screen.getByText('This is page A');

      // Navigate A -> B
      const linkToB = screen.getByText('Go to page B');
      fireEvent.click(linkToB);
      await screen.findByText('This is page B');
      expect(screen.queryByText('This is page A')).not.toBeInTheDocument();

      // Ensure router mock update reflects route change
      const { container: actual } = screen;
      const { container: expected } = render(
        <PageB
          routerMock={{
            asPath: '/client-navigation-link/b',
            pathname: '/client-navigation-link/b',
            query: {},
            route: '/client-navigation-link/b',
            basePath: '',
          }}
        />
      );
      expect(actual).toEqual(expected);
    });
  });

  // @ NOTE This test doesn't actually fail
  // but it forces Jest to render errors about updates after unmount in console
  it('does not re-render (does not update router mock) if page gets unmounted', async () => {
    const Page = await getPage({
      nextRoot,
      route: '/client-navigation-link/a',
    });
    const { unmount } = render(Page);
    const linkToB = screen.getByText('Go to page B');
    fireEvent.click(linkToB);
    unmount();
  });
});
