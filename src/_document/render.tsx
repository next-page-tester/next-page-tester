import React from 'react';
import getCustomDocumentFile from './getCustomDocumentFile';
import fetchDocumentData from './fetchDocumentData';
import type { ExtendedOptions, PageData, PageObject } from '../commonTypes';
import type { RenderPage } from 'next/dist/next-server/lib/utils';
import { APP_PATH } from '../constants';
import { renderToStaticMarkup } from 'react-dom/server';
import { HeadManagerContext } from 'next/dist/next-server/lib/head-manager-context';
import * as nextDocument from 'next/document';
import DefaultDocument, { Main, DocumentProps } from './DefaultDocument';

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
  const customDocumentFile = getCustomDocumentFile({ options });

  const Document = customDocumentFile
    ? customDocumentFile.client.default
    : DefaultDocument;

  let head: JSX.Element[] = [];

  const renderPage: RenderPage = () => {
    const html = renderToStaticMarkup(
      // @NOTE: implemented from:
      // https://github.com/vercel/next.js/blob/v10.0.3/packages/next/next-server/server/render.tsx#L561
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

  // Re-assign default Next.js <Main/> component with mock provided by us
  if (customDocumentFile) {
    // @ts-ignore
    nextDocument.Main = Main;
  }

  const initialProps = await fetchDocumentData({
    Document,
    renderPage,
    pageObject,
  });

  const documentProps: DocumentProps = {
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
    scriptLoader: {},
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
  };

  return Document.renderDocument(Document, documentProps);
}
