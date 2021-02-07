import path from 'path';
import { screen } from '@testing-library/react';
import { getPage } from '../../../src';

// eslint-disable-next-line jest/no-disabled-tests
describe.skip('Modules initialization environment', () => {
  describe.each(['server', 'client'])('%s render', (renderEnvironment) => {
    it('Modules should be initialized in expected environment', async () => {
      const { serverRender, render } = await getPage({
        nextRoot: path.join(__dirname, '__fixtures__'),
        route: '/page',
        nonIsolatedModules: [
          path.resolve(
            path.resolve(__dirname, '__fixtures__', 'statefulModule')
          ),
          path.resolve(path.resolve(__dirname, '__fixtures__', 'appContext')),
        ],
      });

      if (renderEnvironment === 'server') {
        serverRender();
      } else {
        render();
      }

      expect(
        screen.queryByText(`Module initialized in env: ${renderEnvironment}`)
      ).toBeInTheDocument();
      expect(
        screen.queryByText(
          `React context initialized in env: ${renderEnvironment}`
        )
      ).toBeInTheDocument();
    });
  });
});
