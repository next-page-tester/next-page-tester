import React from 'react';
import { getPage } from '../../../src';
import { expectDOMElementsToMatch, renderWithinNextRoot } from '../__utils__';

describe('Runtime Configuration with next/config', () => {
  const initialDomain = process.env.DOMAIN;

  beforeAll(() => {
    process.env.DOMAIN = 'www.example.com';
  });

  afterAll(() => {
    process.env.DOMAIN = initialDomain;
  });

  describe('server runtime', () => {
    it('serverRuntimeConfig and publicRuntimeConfig available', async () => {
      const { serverRender } = await getPage({
        nextRoot: __dirname + '/__fixtures__',
        route: '/page',
      });
      /*
       * @NOTE: we need to import Page component after next-page-tester runs because
       * Page component stores next/config value at module load time when runtime config
       * value is still undefined (This would also happen in an actual Next.js application)
       */
      const { default: Page } = await import('./__fixtures__/pages/page');
      const { nextRoot: actual } = serverRender();
      const { container: expected } = renderWithinNextRoot(
        <Page
          configMock={{
            serverRuntimeConfig: {
              value: 'true',
              domain: 'www.example.com',
            },
            publicRuntimeConfig: {
              value: 'true',
              domain: 'www.example.com',
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
      const { default: Page } = await import('./__fixtures__/pages/page');
      const { nextRoot: actual } = render();
      const { container: expected } = renderWithinNextRoot(
        <Page
          configMock={{
            serverRuntimeConfig: {},
            publicRuntimeConfig: {
              value: 'true',
              domain: 'www.example.com',
            },
          }}
        />
      );
      expectDOMElementsToMatch(actual, expected);
    });
  });
});
