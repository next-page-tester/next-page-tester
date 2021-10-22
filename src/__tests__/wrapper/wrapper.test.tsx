import { getPage } from '../../../src';
import path from 'path';
import { screen } from '@testing-library/react';
import { silenceConsoleError } from '../__utils__';
import { appContextValue } from './__fixtures__/App/wrappers';
import { pageContextValue } from './__fixtures__/Page/wrappers';

silenceConsoleError('Text content did not match.');

const renderMethods = ['serverRender', 'render'] as const;

describe('wrapper', () => {
  describe('.Page', () => {
    renderMethods.forEach((_renderMethod) => {
      describe(_renderMethod, () => {
        it('wraps page component with provided Page enhancer', async () => {
          const { [_renderMethod]: renderMethod } = await getPage({
            nextRoot: path.join(__dirname, '__fixtures__', 'Page'),
            route: '/a',
            wrappers: path.resolve(__dirname, '__fixtures__/Page/wrappers'),
          });

          renderMethod();
          expect(
            screen.getByText(`Source: ${pageContextValue}`)
          ).toBeInTheDocument();
        });
      });
    });
  });

  describe('.App', () => {
    renderMethods.forEach((_renderMethod) => {
      describe(_renderMethod, () => {
        it('wraps app component with provided App enhancer', async () => {
          const { [_renderMethod]: renderMethod } = await getPage({
            nextRoot: path.join(__dirname, '__fixtures__', 'App'),
            route: '/a',
            useApp: false,
            wrappers: path.resolve(__dirname, '__fixtures__/App/wrappers'),
          });

          renderMethod();
          expect(
            screen.queryByText(`Source: ${appContextValue}`)
          ).toBeInTheDocument();
        });
      });
    });
  });
});
