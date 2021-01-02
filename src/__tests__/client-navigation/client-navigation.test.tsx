import React from 'react';
import { render as TLRender, waitFor, within } from '@testing-library/react';
import { getPage } from '../../index';
import { expectDOMElementsToMatch, makeNextRootElement } from '../__utils__';
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
      const { container: actual } = render();
      const { getByText, findByText, queryByText } = within(document.body);
      getByText('This is page A');

      // Navigate A -> B
      userEvent.click(getByText(linkText));
      await findByText('This is page B');
      expect(queryByText('This is page A')).not.toBeInTheDocument();

      // Ensure router mock update reflects route change
      const { container: expected } = TLRender(
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
        />,
        { container: makeNextRootElement() }
      );
      expectDOMElementsToMatch(actual, expected);
    });

    it('GIP navigates between pages ', async () => {
      const { render } = await getPage({
        nextRoot,
        route: `/gip/a`,
      });
      render();
      const { getByText, findByText } = within(document.body);

      getByText(
        JSON.stringify({
          isWindowDefined: false,
          isDocumentDefined: false,
          isReqDefined: true,
          isResDefined: true,
        })
      );

      userEvent.click(getByText(linkText));

      await findByText('This is page B');
      getByText(
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
      const { getByText, findByText } = within(document.body);

      await findByText(
        JSON.stringify({
          isWindowDefined: false,
          isDocumentDefined: false,
          isReqDefined: true,
          isResDefined: true,
        })
      );

      userEvent.click(getByText(linkText));

      await findByText('This is page B');
      getByText(
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
    const { render } = await getPage({
      nextRoot,
      route: '/a',
    });
    const { unmount } = render();
    const { getByText } = within(document.body);
    userEvent.click(getByText('Go to B with Link'));

    unmount();

    await waitFor(() => {
      expect(warn).toHaveBeenCalledWith(
        '[next-page-tester]: Un-awaited client side navigation from "/a" to "/b". This might lead into unexpected bugs and errors.'
      );
    });

    warn.mockRestore();
  });
});
