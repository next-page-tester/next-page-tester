import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getPage } from '../../index';
import Page from './__fixtures__/pages/page';
import path from 'path';

const expectedGlobals_initial = {
  component_importTime_window: true,
  component_importTime_document: true,
  component_runTime_window: true,
  component_runTime_document: true,

  gip_importTime_window: false,
  gip_importTime_document: false,
  gip_runTime_window: false,
  gip_runTime_document: false,
};

const expectedGlobals_clientside = {
  ...expectedGlobals_initial,
  gip_importTime_window: true,
  gip_importTime_document: true,
  gip_runTime_window: true,
  gip_runTime_document: true,
};

describe('Global object', () => {
  describe('_app', () => {
    describe.each(['initial', 'client'])('%s render', (renderType) => {
      it("executes app's exports with expected env globals", async () => {
        const initialRoute = renderType === 'client' ? '/' : '/page';
        const { page } = await getPage({
          nextRoot: path.join(__dirname, '__fixtures__'),
          route: initialRoute,
        });
        const { container: actual } = render(page);

        // Client side navigation to SSR page
        if (renderType === 'client') {
          userEvent.click(screen.getByText('Go to page'));
          await screen.findByText('Page');
        }

        const expectedProps =
          renderType === 'initial'
            ? expectedGlobals_initial
            : expectedGlobals_clientside;

        const { container: expected } = render(<Page {...expectedProps} />);
        expect(actual).toEqual(expected);
      });
    });
  });
});
