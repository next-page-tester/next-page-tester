import React from 'react';
import { render as TLRender, waitFor, screen } from '@testing-library/react';
import { getPage } from '../../../src';
import { expectDOMElementsToMatch, renderWithinNextRoot } from '../__utils__';
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
      const { render } = await getPage({
        nextRoot,
        route: '/a',
      });
      const { nextRoot: actual } = render();
      screen.getByText('This is page A');

      // Navigate A -> B
      userEvent.click(screen.getByText(linkText));
      await screen.findByText('This is page B');
      expect(screen.queryByText('This is page A')).not.toBeInTheDocument();

      // Ensure router mock update reflects route change
      const { container: expected } = renderWithinNextRoot(
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
      expectDOMElementsToMatch(actual, expected);
    });

    it('GIP navigates between pages ', async () => {
      const { render } = await getPage({
        nextRoot,
        route: `/gip/a`,
      });
      render();

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
      const { render } = await getPage({
        nextRoot,
        route: `/ssr/a`,
      });
      render();

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

  it('does not re-render (does not update router mock) if page gets unmounted', async () => {
    const warn = jest.spyOn(console, 'warn').mockImplementationOnce(() => {});
    const { page } = await getPage({
      nextRoot,
      route: '/a',
    });

    const { unmount } = TLRender(page);
    userEvent.click(screen.getByText('Go to B with Link'));

    unmount();

    await waitFor(() => {
      expect(warn).toHaveBeenCalledWith(
        '[next-page-tester] Un-awaited client side navigation from "/a" to "/b". This might lead into unexpected bugs and errors.'
      );
    });

    warn.mockRestore();
  });
});
