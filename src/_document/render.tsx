import React from 'react';
import getCustomDocumentFile from './getCustomDocumentFile';
import fetchDocumentData from './fetchDocumentData';
import type { ExtendedOptions, PageData, PageObject } from '../commonTypes';
import type { DocumentType, RenderPage } from 'next/dist/next-server/lib/utils';
import { APP_PATH } from '../constants';
import { renderToStaticMarkup } from 'react-dom/server';
import { HeadManagerContext } from 'next/dist/next-server/lib/head-manager-context';
import * as nextDocument from 'next/document';
import DefaultDocument, { Main, DocumentProps } from './defaultDocument';

export default async function renderDocument({
  pageElement,
  options,
  pageObject,
  pageData,
}: {
  pageElement: JSX.Element;
  options: ExtendedOptions;
  pageObject: PageObject;
  pageData: PageData;
}): Promise<JSX.Element> {
  const customDocumentFile = await getCustomDocumentFile({ options });

  const Document = customDocumentFile
    ? customDocumentFile.default
    : DefaultDocument;

  let head: JSX.Element[] = [];

  const renderPage: RenderPage = () => {
    const html = renderToStaticMarkup(
      <HeadManagerContext.Provider
        value={{
          updateHead: (state) => {
            head = state;
          },
          mountedInstances: new Set(),
        }}
      >
        {pageElement}
      </HeadManagerContext.Provider>
    );
    return { html, head };
  };

  if (customDocumentFile) {
    // @ts-ignore
    nextDocument.Main = Main;
  }

  const initialProps = await fetchDocumentData({
    Document,
    renderPage,
    pageObject,
  });

  const renderDocument = (Document: DocumentType, props: DocumentProps) => {
    return Document.renderDocument(Document, props);
  };

  return renderDocument(Document, {
    ...initialProps,
    buildManifest: {
      ampDevFiles: [],
      ampFirstPages: [],
      devFiles: [],
      lowPriorityFiles: [],
      polyfillFiles: [],
      pages: {
        [APP_PATH]: [],
        [pageObject.pagePath]: [],
      },
    },
    __NEXT_DATA__: {
      page: pageObject.pagePath,
      query: pageObject.query,
      buildId: 'next-page-tester',
      props: {
        pageProps: pageData.props,
      },
    },
    docComponentsRendered: {},
    dangerousAsPath: '',
    ampPath: '',
    inAmpMode: false,
    dynamicImports: [],
    isDevelopment: false,
    hybridAmp: false,
    canonicalBase: '',
    headTags: [],
    devOnlyCacheBusterQueryString: '',
    pageElement,
  });
}
