import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getPage } from '../../../src';
import { expectDOMElementsToMatch, renderWithinNextRoot } from '../__utils__';
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

describe('Global object', () => {
  describe('page', () => {
    describe('with getServerSideProps', () => {
      describe.each(['server', 'initial', 'client'])(
        '%s render',
        (renderType) => {
          it("executes page's exports with expected env globals", async () => {
            const initialRoute = renderType === 'client' ? '/' : '/ssr';
            const { serverRender, render } = await getPage({
              nextRoot: path.join(__dirname, '__fixtures__'),
              route: initialRoute,
              useApp: false,
            });
            const { nextRoot: actual } =
              renderType === 'server' ? serverRender() : render();

            // Client side navigation to SSR page
            if (renderType === 'client') {
              userEvent.click(screen.getByText('Go to SSR'));
              await screen.findByText('Page');
            }

            //@ts-ignore
            const expectedProps = expectedGlobals[renderType];
            const { container: expected } = renderWithinNextRoot(
              <SSRPage {...expectedProps} />
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
            const { serverRender, render } = await getPage({
              nextRoot: path.join(__dirname, '__fixtures__'),
              route: initialRoute,
              useApp: false,
            });
            const { nextRoot: actual } =
              renderType === 'server' ? serverRender() : render();

            // Client side navigation to SSR page
            if (renderType === 'client') {
              userEvent.click(screen.getByText('Go to GIP'));
              await screen.findByText('Page');
            }

            const expectedProps =
              renderType === 'client'
                ? expectedGlobals.clientWithGIP
                : //@ts-ignore
                  expectedGlobals[renderType];

            const { container: expected } = renderWithinNextRoot(
              <GIPPage {...expectedProps} />
            );
            expectDOMElementsToMatch(actual, expected);
          });
        }
      );
    });
  });
});
