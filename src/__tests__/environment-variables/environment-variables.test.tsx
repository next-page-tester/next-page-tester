import React from 'react';
// @NOTE this tests breaks when tested as "dist"
import { getPage } from '../../../src';
import { expectDOMElementsToMatch, renderWithinNextRoot } from '../__utils__';
import Page from './__fixtures__/env-vars/pages/page';
import EnvVarsCleanupPage from './__fixtures__/no-dotenv-file/pages/page';

process.env.FROM_RUNTIME = 'FROM_RUNTIME';
process.env.NAME_CLASH_RUNTIME_VS_CONFIG = 'FROM_RUNTIME';
process.env.NAME_CLASH_RUNTIME_VS_DOTFILE = 'FROM_RUNTIME';
process.env.NAME_CLASH_RUNTIME_VS_CONFIG_VS_DOTFILE = 'FROM_RUNTIME';

describe('Environment variables', () => {
  describe('server runtime', () => {
    it('env vars from config and dotenv file both available (config takes precedence)', async () => {
      const { serverRender } = await getPage({
        nextRoot: __dirname + '/__fixtures__' + '/env-vars',
        route: '/page',
        dotenvFile: '.env.test',
      });
      const { nextRoot: actual } = serverRender();
      const { container: expected } = renderWithinNextRoot(
        <Page
          envVarsMock={{
            FROM_RUNTIME: 'FROM_RUNTIME',
            FROM_CONFIG: 'FROM_CONFIG',
            FROM_DOTFILE: 'FROM_DOTFILE',
            FROM_DOTFILE_EXPANDED: 'FROM_DOTFILE_EXPANDED',
            NEXT_PUBLIC_FROM_DOTFILE: 'NEXT_PUBLIC_FROM_DOTFILE',

            NAME_CLASH_RUNTIME_VS_CONFIG: 'FROM_CONFIG',
            NAME_CLASH_RUNTIME_VS_DOTFILE: 'FROM_RUNTIME',
            NAME_CLASH_RUNTIME_VS_CONFIG_VS_DOTFILE: 'FROM_CONFIG',
          }}
        />
      );
      expectDOMElementsToMatch(actual, expected);
    });
  });

  describe('public runtime', () => {
    it('Env vars from dot env file only available when prefixed with "NEXT_PUBLIC_"', async () => {
      const { render } = await getPage({
        nextRoot: __dirname + '/__fixtures__' + '/env-vars',
        route: '/page',
        dotenvFile: '.env.test',
      });
      const { nextRoot: actual } = render();
      const { container: expected } = renderWithinNextRoot(
        <Page
          envVarsMock={{
            FROM_RUNTIME: 'FROM_RUNTIME',
            FROM_CONFIG: 'FROM_CONFIG',
            FROM_DOTFILE: undefined,
            FROM_DOTFILE_EXPANDED: undefined,
            NEXT_PUBLIC_FROM_DOTFILE: 'NEXT_PUBLIC_FROM_DOTFILE',

            NAME_CLASH_RUNTIME_VS_CONFIG: 'FROM_CONFIG',
            NAME_CLASH_RUNTIME_VS_DOTFILE: 'FROM_RUNTIME',
            NAME_CLASH_RUNTIME_VS_CONFIG_VS_DOTFILE: 'FROM_CONFIG',
          }}
        />
      );
      expectDOMElementsToMatch(actual, expected);
    });
  });

  it('Env vars do not leak into subsequent tests', async () => {
    const { render } = await getPage({
      nextRoot: __dirname + '/__fixtures__' + '/no-dotenv-file',
      route: '/page',
    });
    const { nextRoot: actual } = render();
    const { container: expected } = renderWithinNextRoot(
      <EnvVarsCleanupPage
        envVarsMock={{
          FROM_RUNTIME: 'FROM_RUNTIME',
          NAME_CLASH_RUNTIME_VS_CONFIG: 'FROM_RUNTIME',
          NAME_CLASH_RUNTIME_VS_DOTFILE: 'FROM_RUNTIME',
          NAME_CLASH_RUNTIME_VS_CONFIG_VS_DOTFILE: 'FROM_RUNTIME',
        }}
      />
    );
    expectDOMElementsToMatch(actual, expected);
  });

  it('Triggers console.warn if provided "dotenvFile" doesn\'t exist', async () => {
    jest.spyOn(global.console, 'warn').mockImplementation(() => {});
    await getPage({
      nextRoot: __dirname + '/__fixtures__' + '/env-vars',
      route: '/page',
      dotenvFile: '.env.does-not-exist',
    });

    expect(console.warn).toBeCalledWith(
      expect.stringContaining(
        '[next-page-tester] Cannot find env file at path:'
      )
    );
    jest.restoreAllMocks();
  });
});
