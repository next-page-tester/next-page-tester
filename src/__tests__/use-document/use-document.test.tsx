import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import path from 'path';
import { getPage } from '../../index';
import CustomDocumentWithGIP_Page from './__fixtures__/custom-document-with-gip/pages/page';
import CustomApp from './__fixtures__/custom-document-with-gip/pages/_app';

describe('_document support', () => {
  describe('_document with getInitialProps', () => {
    describe('with custom _app', () => {
      it('renders page wrapped in custom _app wrapped in _document', async () => {
        const { page } = await getPage({
          nextRoot: __dirname + '/__fixtures__/custom-document-with-gip',
          route: '/page',
          useDocument: true,
        });
        const { container } = render(page);
        const head = container.querySelector('head') as HTMLHeadElement;
        const html = container.querySelector('html') as HTMLHtmlElement;
        expect(html).toHaveAttribute('lang', 'en');
        expect(head.querySelector('meta[name="Description"]')).toHaveAttribute(
          'Content',
          'Custom document description'
        );
        const actual = container.querySelector('#__next') as HTMLDivElement;
        actual.removeAttribute('id');

        const { container: expected } = render(
          <CustomApp Component={CustomDocumentWithGIP_Page} pageProps={{}} />
        );

        expect(actual).toEqual(expected);
      });
    });
  });

  describe('_document with special extensions', () => {
    it('renders expected document component', async () => {
      const route = '/page';
      const { page } = await getPage({
        nextRoot: __dirname + '/__fixtures__/special-extension',
        route,
        useDocument: true,
      });

      const { container } = render(page);

      const head = container.querySelector('head') as HTMLHeadElement;
      expect(head.querySelector('meta[name="Description"]')).toHaveAttribute(
        'Content',
        'Document with special extension'
      );
    });
  });

  describe('useCustomDocument === false', () => {
    it("doesn't render wrapping document", async () => {
      const { page } = await getPage({
        nextRoot: __dirname + '/__fixtures__/custom-document-with-gip',
        route: '/page',
        useDocument: false,
      });

      const { container: actual } = render(page);
      const { container: expected } = render(
        <CustomApp Component={CustomDocumentWithGIP_Page} pageProps={{}} />
      );

      expect(actual).toEqual(expected);
    });
  });

  describe.each([['custom-document-with-gip'], ['default-document']])(
    'Page with %s',
    (directory) => {
      it('User events are propagated', async () => {
        const { page } = await getPage({
          nextRoot: path.join(__dirname, '__fixtures__', directory),
          route: '/page',
          useDocument: true,
        });

        const { container } = render(page);

        expect(container.querySelector('head')).toBeInTheDocument();
        expect(screen.queryByText('Count: 0')).toBeInTheDocument();

        userEvent.click(screen.getByText('Count me!'));
        expect(screen.getByText('Count: 1')).toBeInTheDocument();
      });
    }
  );
});
