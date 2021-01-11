import path from 'path';
import { screen } from '@testing-library/react';
import { getPage } from '../../index';

describe('_error support', () => {
  describe('with-default-error', () => {
    describe.each([['ssr'], ['gip']])(
      '%s page with-default-error',
      (dataFetchingMethod) => {
        it('Correctly renders 500 error', async () => {
          const { render } = await getPage({
            nextRoot: path.join(
              __dirname,
              '__fixtures__',
              'with-default-error',
              dataFetchingMethod
            ),
            route: '/a',
          });
          render();

          expect(
            screen.getByText('Internal Server Error.')
          ).toBeInTheDocument();
          expect(screen.getByText('500')).toBeInTheDocument();
        });

        it('Correctly renders 404 error', async () => {
          const { render } = await getPage({
            nextRoot: path.join(
              __dirname,
              '__fixtures__',
              'with-default-error',
              dataFetchingMethod
            ),
            route: '/random',
          });

          render();
          expect(
            screen.getByText('This page could not be found.')
          ).toBeInTheDocument();
          expect(screen.getByText('404')).toBeInTheDocument();
        });
      }
    );
  });

  describe('with-custom-error', () => {
    describe.each([['ssr'], ['gip']])(
      '%s page with-custom-error',
      (dataFetchingMethod) => {
        it('Correctly renders 500 _error page', async () => {
          const { render } = await getPage({
            nextRoot: path.join(
              __dirname,
              '__fixtures__',
              'with-custom-error',
              dataFetchingMethod
            ),
            route: '/a',
          });

          render();
          expect(
            screen.getByText(
              '[CustomError] It looks like we have some problems. Status: 500'
            )
          ).toBeInTheDocument();
        });

        it('Correctly renders 404 error', async () => {
          const { render } = await getPage({
            nextRoot: path.join(
              __dirname,
              '__fixtures__',
              'with-custom-error',
              dataFetchingMethod
            ),
            route: '/random',
          });

          render();
          expect(
            screen.getByText(
              '[CustomError] It looks like we have some problems. Status: 404'
            )
          ).toBeInTheDocument();
        });
      }
    );
  });
});
