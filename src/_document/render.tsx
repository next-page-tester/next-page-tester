import React, { useContext } from 'react';
import NextDocument from 'next/document';
import getCustomDocumentFile from './getCustomDocumentFile';
import getDocumentInitialProps from './getDocumentInitialProps';
import type { ExtendedOptions, PageData, PageObject } from '../commonTypes';
import type { DocumentType, RenderPage } from 'next/dist/next-server/lib/utils';
import { APP_PATH } from '../constants';
import { renderToStaticMarkup } from 'react-dom/server';
import { HeadManagerContext } from 'next/dist/next-server/lib/head-manager-context';
import { DocumentContext } from 'next/dist/next-server/lib/document-context';
import * as documentModule from 'next/document';
import { AMP_RENDER_TARGET } from 'next/constants';

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
    : ((NextDocument as unknown) as DocumentType);

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

  // https://github.com/vercel/next.js/blob/v10.0.3/packages/next/pages/_document.tsx#L524
  // Default behaviour of Main component is to dangerouslySetInnerHTML with the html
  // string rendered above. This works, but will break all client side interactions
  // as event handlers are lost in static markup
  // @ts-ignore
  documentModule.Main = () => {
    const { inAmpMode, docComponentsRendered } = useContext(DocumentContext);
    docComponentsRendered.Main = true;
    if (inAmpMode) return <>{AMP_RENDER_TARGET}</>;
    return <div id="__next">{pageElement}</div>;
  };

  const initialProps = await getDocumentInitialProps({
    Document,
    renderPage,
    pageObject,
  });

  return Document.renderDocument(Document, {
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
  });
}
