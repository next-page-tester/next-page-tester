import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getPage } from '../../index';
import SSRPage from './__fixtures__/pages/ssr';
import GIPPage from './__fixtures__/pages/gip';
import path from 'path';

const expectedGlobals = {
  component_importTime_window: true,
  component_importTime_document: true,
  component_runTime_window: true,
  component_runTime_document: true,

  dataFetching_importTime_window: false,
  dataFetching_importTime_document: false,
  dataFetching_runTime_window: false,
  dataFetching_runTime_document: false,
};

const expectedGlobals_GIPClientSide = {
  ...expectedGlobals,
  dataFetching_importTime_window: true,
  dataFetching_importTime_document: true,
  dataFetching_runTime_window: true,
  dataFetching_runTime_document: true,
};

describe('Global object', () => {
  describe('getServerSideProps', () => {
    describe.each(['initial', 'client'])('%s render', (renderType) => {
      it("executes page's exports with expected env globals", async () => {
        const initialRoute = renderType === 'client' ? '/' : '/ssr';
        const { page } = await getPage({
          nextRoot: path.join(__dirname, '__fixtures__'),
          route: initialRoute,
        });
        const { container: actual } = render(page);

        // Client side navigation to SSR page
        if (renderType === 'client') {
          userEvent.click(screen.getByText('Go to SSR'));
          await screen.findByText('Page');
        }

        const expectedProps = expectedGlobals;
        const { container: expected } = render(<SSRPage {...expectedProps} />);
        expect(actual).toEqual(expected);
      });
    });
  });

  describe('getInitialProps', () => {
    describe.each(['initial', 'client'])('%s render', (renderType) => {
      it("executes page's exports with expected env globals", async () => {
        const initialRoute = renderType === 'client' ? '/' : '/gip';
        const { page } = await getPage({
          nextRoot: path.join(__dirname, '__fixtures__'),
          route: initialRoute,
        });
        const { container: actual } = render(page);

        if (renderType === 'client') {
          userEvent.click(screen.getByText('Go to GIP'));
          await screen.findByText('Page');
        }

        const expectedProps =
          renderType === 'client'
            ? expectedGlobals_GIPClientSide
            : expectedGlobals;

        const { container: expected } = render(<GIPPage {...expectedProps} />);
        expect(actual).toEqual(expected);
      });
    });
  });
});
