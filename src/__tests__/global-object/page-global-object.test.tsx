import React from 'react';
import { render as TLRender, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getPage } from '../../index';
import {
  expectDOMElementsToMatch,
  makeNextRootElement,
  getNextRootElement,
} from '../__utils__';
import SSRPage from './__fixtures__/pages/ssr';
import GIPPage from './__fixtures__/pages/gip';
import path from 'path';

const expectedGlobals = {
  server: {
    component_importTime_window: false,
    component_importTime_document: false,
    component_runTime_window: false,
    component_runTime_document: false,

    dataFetching_importTime_window: false,
    dataFetching_importTime_document: false,
    dataFetching_runTime_window: false,
    dataFetching_runTime_document: false,
  },
  initial: {
    component_importTime_window: true,
    component_importTime_document: true,
    component_runTime_window: true,
    component_runTime_document: true,

    dataFetching_importTime_window: false,
    dataFetching_importTime_document: false,
    dataFetching_runTime_window: false,
    dataFetching_runTime_document: false,
  },
  client: {
    component_importTime_window: true,
    component_importTime_document: true,
    component_runTime_window: true,
    component_runTime_document: true,

    dataFetching_importTime_window: false,
    dataFetching_importTime_document: false,
    dataFetching_runTime_window: false,
    dataFetching_runTime_document: false,
  },
  clientWithGIP: {
    component_importTime_window: true,
    component_importTime_document: true,
    component_runTime_window: true,
    component_runTime_document: true,

    dataFetching_importTime_window: true,
    dataFetching_importTime_document: true,
    dataFetching_runTime_window: true,
    dataFetching_runTime_document: true,
  },
};

describe.skip('Global object', () => {
  describe('page', () => {
    describe('with getServerSideProps', () => {
      describe.each(['server', 'initial', 'client'])(
        '%s render',
        (renderType) => {
          it("executes page's exports with expected env globals", async () => {
            const initialRoute = renderType === 'client' ? '/' : '/ssr';
            const { render, renderHtml } = await getPage({
              nextRoot: path.join(__dirname, '__fixtures__'),
              route: initialRoute,
              useApp: false,
            });

            if (renderType === 'server') {
              renderHtml();
            } else {
              render();
            }

            const actual = getNextRootElement();
            const { findByText, getByText } = within(document.body);

            // Client side navigation to SSR page
            if (renderType === 'client') {
              userEvent.click(getByText('Go to SSR'));
              await findByText('Page');
            }

            //@ts-ignore
            const expectedProps = expectedGlobals[renderType];
            const { container: expected } = TLRender(
              <SSRPage {...expectedProps} />,
              { container: makeNextRootElement() }
            );
            expectDOMElementsToMatch(actual, expected);
          });
        }
      );
    });

    describe('with getInitialProps', () => {
      describe.each(['server', 'initial', 'client'])(
        '%s render',
        (renderType) => {
          it("executes page's exports with expected env globals", async () => {
            const initialRoute = renderType === 'client' ? '/' : '/gip';
            const { render, renderHtml } = await getPage({
              nextRoot: path.join(__dirname, '__fixtures__'),
              route: initialRoute,
              useApp: false,
            });

            if (renderType === 'server') {
              renderHtml();
            } else {
              render();
            }

            const actual = getNextRootElement();
            const { findByText, getByText } = within(document.body);

            if (renderType === 'client') {
              userEvent.click(getByText('Go to GIP'));
              await findByText('Page');
            }

            const expectedProps =
              renderType === 'client'
                ? expectedGlobals.clientWithGIP
                : //@ts-ignore
                  expectedGlobals[renderType];

            const { container: expected } = TLRender(
              <GIPPage {...expectedProps} />,
              { container: makeNextRootElement() }
            );
            expectDOMElementsToMatch(actual, expected);
          });
        }
      );
    });
  });
});
