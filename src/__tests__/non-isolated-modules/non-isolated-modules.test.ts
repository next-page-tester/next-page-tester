import { getPage } from '../../../src';
import path from 'path';
import { screen } from '@testing-library/react';

describe('non-isolated-modules', () => {
  describe.each([
    'with-app-fn-enhancer',
    'with-app-object-enhancer',
    'with-component-object-enhancer',
  ])('%s render', (enhancerType) => {
    it("executes app's exports with expected env globals", async () => {
      const consoleError = jest
        .spyOn(console, 'error')
        .mockImplementation(() => null);

      const { render } = await getPage({
        nextRoot: path.join(__dirname, '__fixtures__', enhancerType),
        route: '/a',
        useDocument: true,
        // If removed we would see "Warning: Text content did not match. Server: "10" Client: "150"" error
        nonIsolatedModules: [
          path.join(
            process.cwd(),
            'src/__tests__/non-isolated-modules/__fixtures__/counter'
          ),
        ],
      });

      render();

      await screen.findByText('150');

      expect(consoleError).not.toBeCalled();
    });
  });
});
