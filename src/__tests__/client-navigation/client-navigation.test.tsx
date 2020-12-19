import React from 'react';
import { render, screen } from '@testing-library/react';
import { getPage } from '../../index';
import PageB from './__fixtures__/pages/b';
import userEvent from '@testing-library/user-event';
import type { NextRouter } from 'next/router';

const nextRoot = __dirname + '/__fixtures__';

describe('Client side navigation', () => {
  describe.each`
    title                     | linkText
    ${'using Link component'} | ${'Go to B with Link'}
    ${'programmatically'}     | ${'Go to B programmatically'}
  `('$title', ({ linkText }) => {
    it('navigates between pages', async () => {
      const { page } = await getPage({
        nextRoot,
        route: '/a',
      });
      const screen = render(page);
      screen.getByText('This is page A');

      // Navigate A -> B
      userEvent.click(screen.getByText(linkText));
      await screen.findByText('This is page B');
      expect(screen.queryByText('This is page A')).not.toBeInTheDocument();

      // Ensure router mock update reflects route change
      const { container: actual } = screen;
      const { container: expected } = render(
        <PageB
          routerMock={
            {
              asPath: '/b',
              pathname: '/b',
              query: {},
              route: '/b',
              basePath: '',
            } as NextRouter
          }
        />
      );
      expect(actual).toEqual(expected);
    });

    it('GIP navigates between pages ', async () => {
      const { page } = await getPage({
        nextRoot,
        route: `/gip/a`,
      });
      render(page);

      screen.getByText(
        JSON.stringify({
          isWindowDefined: false,
          isDocumentDefined: false,
          isReqDefined: true,
          isResDefined: true,
        })
      );

      userEvent.click(screen.getByText(linkText));

      await screen.findByText('This is page B');
      screen.getByText(
        JSON.stringify({
          isWindowDefined: true,
          isDocumentDefined: true,
          isReqDefined: false,
          isResDefined: false,
        })
      );
    });

    it('SSR navigates between pages ', async () => {
      const { page } = await getPage({
        nextRoot,
        route: `/ssr/a`,
      });
      render(page);

      await screen.findByText(
        JSON.stringify({
          isWindowDefined: false,
          isDocumentDefined: false,
          isReqDefined: true,
          isResDefined: true,
        })
      );

      userEvent.click(screen.getByText(linkText));

      await screen.findByText('This is page B');
      screen.getByText(
        JSON.stringify({
          isWindowDefined: false,
          isDocumentDefined: false,
          isReqDefined: true,
          isResDefined: true,
        })
      );
    });
  });

  // @ NOTE This test doesn't actually fail
  // but it forces Jest to render errors about updates after unmount in console
  it('does not re-render (does not update router mock) if page gets unmounted', async () => {
    const { page } = await getPage({
      nextRoot,
      route: '/a',
    });
    const { unmount } = render(page);
    userEvent.click(screen.getByText('Go to B with Link'));
    unmount();
  });
});
