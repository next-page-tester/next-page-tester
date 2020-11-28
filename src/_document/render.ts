import NextDocument from 'next/document';
import getCustomDocumentFile from './getCustomDocumentFile';
import getDocumentInitialProps from './getDocumentInitialProps';
import type { ExtendedOptions, PageData, PageObject } from '../commonTypes';
import type { DocumentType, RenderPage } from 'next/dist/next-server/lib/utils';
import { APP_PATH } from '../constants';
import { renderToStaticMarkup } from 'react-dom/server';

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

  // TODO: this should get updated by HeadManagerContext
  // See: https://github.com/vercel/next.js/blob/2790ea411b8b0bf2be627a5cc5ba77626079c46d/packages/next/next-server/server/render.tsx#L563
  // Problem, can we get this to evaluate to false: https://github.com/vercel/next.js/blob/2790ea411b8b0bf2be627a5cc5ba77626079c46d/packages/next/next-server/lib/side-effect.tsx#L3?
  const head: JSX.Element[] = [];

  const renderPage: RenderPage = () => {
    // Render markup that will be injected into #__next element by Next.JS in the Main component of Document
    const html = renderToStaticMarkup(pageElement);
    return { html, head };
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
