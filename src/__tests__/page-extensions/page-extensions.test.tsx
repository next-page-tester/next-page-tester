import { screen } from '@testing-library/react';
import { getPage } from '../../../src';

describe('page file extensions', () => {
  describe('default next.config file', () => {
    const nextRoot = __dirname + '/__fixtures__' + '/default-config';
    describe.each(['js', 'jsx', 'ts', 'tsx'])('%s extension', (extension) => {
      it('renders expected page', async () => {
        const { render } = await getPage({
          nextRoot,
          route: `/${extension}`,
        });
        render();
        screen.getByText(`${extension} page`);
      });
    });

    describe('unknown extension', () => {
      it('throws "page not found" error', async () => {
        const { render } = await getPage({
          nextRoot,
          route: '/invalid',
        });
        render();
        expect(screen.getByText('404')).toBeInTheDocument();

        expect(
          screen.getByText('This page could not be found.')
        ).toBeInTheDocument();
      });
    });
  });

  describe('custom next.config file where only .ts allowed', () => {
    const nextRoot = __dirname + '/__fixtures__' + '/custom-config';
    describe('allowed extensions', () => {
      it('renders expected page', async () => {
        const { render } = await getPage({
          nextRoot,
          route: '/ts',
        });
        render();
        screen.getByText('ts page');
      });
    });

    describe('not allowed extensions', () => {
      it('throws "page not found" error', async () => {
        const { render } = await getPage({
          nextRoot,
          route: '/js',
        });

        render();
        expect(screen.getByText('404')).toBeInTheDocument();

        expect(
          screen.getByText('This page could not be found.')
        ).toBeInTheDocument();
      });
    });
  });
});
