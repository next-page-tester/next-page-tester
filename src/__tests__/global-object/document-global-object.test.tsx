import path from 'path';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getPage } from '../../../src';
import { getMetaTagsContentByName } from '../__utils__/_document';

describe('Global object', () => {
  describe('_document', () => {
    describe.each(['server', 'initial', 'client'])(
      '%s render',
      (renderType) => {
        it("executes page's exports with expected env globals", async () => {
          const initialRoute = renderType === 'client' ? '/' : '/ssr';
          const { serverRender, render } = await getPage({
            nextRoot: path.join(__dirname, '__fixtures__'),
            route: initialRoute,
            useDocument: true,
          });

          renderType === 'server' ? serverRender() : render();

          // Client side navigation to SSR page
          if (renderType === 'client') {
            userEvent.click(screen.getByText('Go to SSR'));
            await screen.findByText('Page');
          }

          expect(
            JSON.parse(
              getMetaTagsContentByName(
                document.documentElement,
                'global-object'
              )[0]
            )
          ).toEqual({
            importTime_document: false,
            importTime_window: false,
            gip_runTime_window: false,
            gip_runTime_document: false,
            component_runTime_window: false,
            component_runTime_document: false,
          });
        });
      }
    );
  });
});
