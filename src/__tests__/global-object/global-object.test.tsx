import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getPage } from '../../index';
import SSRPage from './__fixtures__/pages/ssr';
import GIPPage from './__fixtures__/pages/gip';
import path from 'path';

const expectedGlobals = {
  window_moduleLoadTime: false,
  document_moduleLoadTime: false,
  isWeb_moduleLoadTime: false,

  window_dataFetchingScope: false,
  document_dataFetchingScope: false,
  isWeb_dataFetchingScope: false,

  window_componentScope: true,
  document_componentScope: true,
  isWeb_componentScope: true,

  window_componentScope_moduleLoadTime: true,
  document_componentScope_moduleLoadTime: true,
  isWeb_componentScope_moduleLoadTime: true,
};

const expectedGlobals_GIPClientSide = {
  ...expectedGlobals,

  window_dataFetchingScope: true,
  document_dataFetchingScope: true,
  isWeb_dataFetchingScope: true,
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
