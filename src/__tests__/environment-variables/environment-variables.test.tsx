import React from 'react';
import { getPage } from '../../index';
import { expectDOMElementsToMatch, renderWithinNextRoot } from '../__utils__';

describe('Environment variables', () => {
  describe('server runtime', () => {
    it('env vars from config and dotenv file both available (config takes precedence)', async () => {
      const { serverRender } = await getPage({
        nextRoot: __dirname + '/__fixtures__',
        route: '/page',
      });
      const { default: Page } = await import('./__fixtures__/pages/page');
      const { nextRoot: actual } = serverRender();
      const { container: expected } = renderWithinNextRoot(
        <Page
          envVarsMock={{
            FROM_CONFIG: 'FROM_CONFIG',
            FROM_DOTFILE: 'FROM_DOTFILE',
            NEXT_PUBLIC_FROM_DOTFILE: 'NEXT_PUBLIC_FROM_DOTFILE',
            NEXT_PUBLIC_NAME_CLASH: 'NEXT_PUBLIC_NAME_CLASH_FROM_CONFIG',
          }}
        />
      );
      expectDOMElementsToMatch(actual, expected);
    });
  });

  describe('public runtime', () => {
    it('Env vars from dot env file only available when prefixed with "NEXT_PUBLIC_"', async () => {
      const { render } = await getPage({
        nextRoot: __dirname + '/__fixtures__',
        route: '/page',
      });
      const { default: Page } = await import('./__fixtures__/pages/page');
      const { nextRoot: actual } = render();
      const { container: expected } = renderWithinNextRoot(
        <Page
          envVarsMock={{
            FROM_CONFIG: 'FROM_CONFIG',
            FROM_DOTFILE: undefined,
            NEXT_PUBLIC_FROM_DOTFILE: 'NEXT_PUBLIC_FROM_DOTFILE',
            NEXT_PUBLIC_NAME_CLASH: 'NEXT_PUBLIC_NAME_CLASH_FROM_CONFIG',
          }}
        />
      );
      expectDOMElementsToMatch(actual, expected);
    });
  });
});
