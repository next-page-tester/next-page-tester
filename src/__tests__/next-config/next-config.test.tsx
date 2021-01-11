import React from 'react';
import { getPage } from '../../index';
import { expectDOMElementsToMatch, renderWithinNextRoot } from '../__utils__';
import Page from './__fixtures__/pages/page';

describe('Runtime Configuration with next/config', () => {
  describe('server runtime', () => {
    it('serverRuntimeConfig and publicRuntimeConfig available', async () => {
      const { serverRender } = await getPage({
        nextRoot: __dirname + '/__fixtures__',
        route: '/page',
      });
      const { nextRoot: actual } = serverRender();
      const { container: expected } = renderWithinNextRoot(
        <Page
          configMock={{
            serverRuntimeConfig: {
              value: 'true',
            },
            publicRuntimeConfig: {
              value: 'true',
            },
          }}
        />
      );
      expectDOMElementsToMatch(actual, expected);
    });
  });

  describe('public runtime', () => {
    it('only publicRuntimeConfig available', async () => {
      const { render } = await getPage({
        nextRoot: __dirname + '/__fixtures__',
        route: '/page',
      });
      const { nextRoot: actual } = render();
      const { container: expected } = renderWithinNextRoot(
        <Page
          configMock={{
            publicRuntimeConfig: {
              value: 'true',
            },
          }}
        />
      );
      expectDOMElementsToMatch(actual, expected);
    });
  });
});
