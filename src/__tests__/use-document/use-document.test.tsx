import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import path from 'path';
import { getPage } from '../../index';
import { expectDOMElementsToMatch } from '../__utils__';
import CustomDocumentWithGIP_Page from './__fixtures__/custom-document-with-gip/pages/page';
import CustomApp from './__fixtures__/custom-document-with-gip/pages/_app';
import { getMetaTagsContentByName } from '../__utils__/_document';

describe('_document support', () => {
  describe('_document with getInitialProps', () => {
    describe('with custom _app', () => {
      it('renders page wrapped in custom _app wrapped in _document', async () => {
        const { renderHTML } = await getPage({
          nextRoot: __dirname + '/__fixtures__/custom-document-with-gip',
          route: '/page',
          useDocument: true,
        });
        renderHTML();

        const html = document.documentElement;
        expect(html).toHaveAttribute('lang', 'en');

        const actual = document.querySelector('#__next') as HTMLDivElement;
        actual.removeAttribute('id');

        const { container: expected } = render(
          <CustomApp Component={CustomDocumentWithGIP_Page} pageProps={{}} />
        );
        expectDOMElementsToMatch(actual, expected);
      });
    });
  });

  describe('_document with special extensions', () => {
    it('renders expected document component', async () => {
      const route = '/page';
      const { renderHTML } = await getPage({
        nextRoot: __dirname + '/__fixtures__/special-extension',
        route,
        useDocument: true,
      });
      renderHTML();

      const metaDescriptions = getMetaTagsContentByName(
        document.documentElement,
        'description'
      );
      expect(metaDescriptions[0]).toBe('Document with special extension');
    });
  });

  describe('useCustomDocument === false', () => {
    it('renders default empty document', async () => {
      const { renderHTML } = await getPage({
        nextRoot: __dirname + '/__fixtures__/custom-document-with-gip',
        route: '/page',
        useDocument: false,
      });
      renderHTML();

      const actual = document.documentElement;
      const { container: expected } = render(
        <>
          <head></head>
          <body>
            <div id="__next">
              <CustomApp
                Component={CustomDocumentWithGIP_Page}
                pageProps={{}}
              />
            </div>
          </body>
        </>,
        { container: document.createElement('html') }
      );

      expectDOMElementsToMatch(actual, expected);
    });
  });

  describe.each([['custom-document-with-gip'], ['default-document']])(
    'Page with %s',
    (directory) => {
      it('User events are propagated', async () => {
        const { render } = await getPage({
          nextRoot: path.join(__dirname, '__fixtures__', directory),
          route: '/page',
          useDocument: true,
        });
        render();

        screen.getByText('Count: 0');
        userEvent.click(screen.getByText('Count me!'));
        screen.getByText('Count: 1');
      });
    }
  );

  describe('next/document Head and next/head', () => {
    describe('SSR render', () => {
      it('merges _document and page head elements', async () => {
        const { renderHTML } = await getPage({
          nextRoot: path.join(
            __dirname,
            '/__fixtures__/custom-document-with-gip'
          ),
          route: '/page',
          useDocument: true,
        });
        renderHTML();

        const metaDescriptions = getMetaTagsContentByName(
          document.documentElement,
          'description'
        );
        expect(metaDescriptions.length).toBe(2);
        expect(metaDescriptions[0]).toBe('Custom document description');
        expect(metaDescriptions[1]).toBe('Page description');
      });
    });

    describe('on client navigation', () => {
      it('merges _document and page head elements', async () => {
        const { render } = await getPage({
          nextRoot: path.join(
            __dirname,
            '/__fixtures__/custom-document-with-gip'
          ),
          route: '/page',
          useDocument: true,
        });
        render();

        userEvent.click(screen.getByText('Go to A'));
        await screen.findByText('This is page A');

        const metaDescriptions = getMetaTagsContentByName(
          document.documentElement,
          'description'
        );
        expect(metaDescriptions.length).toBe(2);
        expect(metaDescriptions[0]).toBe('Custom document description');
        expect(metaDescriptions[1]).toBe('Page A description');
      });
    });
  });
});
