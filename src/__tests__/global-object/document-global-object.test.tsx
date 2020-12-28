import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getPage } from '../../index';
import path from 'path';

describe('Global object', () => {
  describe('_document', () => {
    describe.each(['initial', 'client'])('%s render', (renderType) => {
      it("executes page's exports with expected env globals", async () => {
        const initialRoute = renderType === 'client' ? '/' : '/ssr';
        const { page } = await getPage({
          nextRoot: path.join(__dirname, '__fixtures__'),
          route: initialRoute,
          useDocument: true,
        });
        const { container } = render(page);

        // Client side navigation to SSR page
        if (renderType === 'client') {
          userEvent.click(screen.getByText('Go to SSR'));
          await screen.findByText('Page');
        }

        const head = container.querySelector('head') as HTMLHeadElement;
        expect(
          JSON.parse(
            (head.querySelector(
              'meta[name="global-object"]'
            ) as HTMLMetaElement).content
          )
        ).toEqual({
          importTime_document: false,
          importTime_window: false,
          gip_runTime_window: false,
          gip_runTime_document: false,
          component_runTime_window: true, // TODO: should be false
          component_runTime_document: true, // TODO: should be false
        });
      });
    });
  });
});
