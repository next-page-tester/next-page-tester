import path from 'path';
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getPage } from '../../index';
import { expectDOMElementsToMatch, renderWithinNextRoot } from '../__utils__';
import Page from './__fixtures__/pages/page';

const expectedGlobals = {
  server: {
    component_importTime_window: false,
    component_importTime_document: false,
    component_runTime_window: false,
    component_runTime_document: false,

    gip_importTime_window: false,
    gip_importTime_document: false,
    gip_runTime_window: false,
    gip_runTime_document: false,
  },
  initial: {
    component_importTime_window: true,
    component_importTime_document: true,
    component_runTime_window: true,
    component_runTime_document: true,

    gip_importTime_window: false,
    gip_importTime_document: false,
    gip_runTime_window: false,
    gip_runTime_document: false,
  },
  client: {
    component_importTime_window: true,
    component_importTime_document: true,
    component_runTime_window: true,
    component_runTime_document: true,

    gip_importTime_window: true,
    gip_importTime_document: true,
    gip_runTime_window: true,
    gip_runTime_document: true,
  },
};

describe('Global object', () => {
  describe('_app', () => {
    describe.each(['server', 'initial', 'client'])(
      '%s render',
      (renderType) => {
        it("executes app's exports with expected env globals", async () => {
          const initialRoute = renderType === 'client' ? '/' : '/page';
          const { render, serverRender } = await getPage({
            nextRoot: path.join(__dirname, '__fixtures__'),
            route: initialRoute,
          });

          const { nextRoot: actual } =
            renderType === 'server' ? serverRender() : render();

          // Client side navigation to SSR page
          if (renderType === 'client') {
            userEvent.click(screen.getByText('Go to page'));
            await screen.findByText('Page');
          }

          // @ts-ignore
          const expectedProps = expectedGlobals[renderType];
          const { container: expected } = renderWithinNextRoot(
            <Page {...expectedProps} />
          );
          expectDOMElementsToMatch(actual, expected);
        });
      }
    );
  });
});
