import React from 'react';
import type { NextPage } from 'next';
import getDocumentFile from './getDocumentFile';
import fetchDocumentData from './fetchDocumentData';
import {
  ExtendedOptions,
  PageObject,
  PageProps,
  NextApp,
} from '../commonTypes';
import type {
  ComponentsEnhancer,
  NextComponentType,
  RenderPage,
} from 'next/dist/next-server/lib/utils';
import {
  APP_PATH,
  NEXT_ROOT_ELEMENT_ID,
  RuntimeEnvironment,
} from '../constants';
import { renderToString } from 'react-dom/server';
import { HeadManagerContext } from 'next/dist/next-server/lib/head-manager-context';
import type { DocumentProps } from 'next/document';
import { getPageComponents } from '../makePageElement';

// Copied from next.js
// https://github.com/vercel/next.js/blob/b944b06f30322076ceb9020c10cb9bf3448d2659/packages/next/next-server/server/render.tsx#L127
function enhanceComponents(
  options: ComponentsEnhancer,
  App: NextApp,
  Component: NextComponentType
): {
  App: NextApp;
  Component: NextComponentType;
} {
  // For backwards compatibility
  if (typeof options === 'function') {
    return {
      App,
      Component: options(Component),
    };
  }

  return {
    App: options.enhanceApp ? (options.enhanceApp(App) as NextApp) : App,
    Component: options.enhanceComponent
      ? options.enhanceComponent(Component)
      : Component,
  };
}

export default async function renderDocument({
  options,
  pageProps,
  pageObject,
  wrapWithRouter,
}: {
  options: ExtendedOptions;
  pageProps: PageProps | undefined;
  pageObject: PageObject;
  wrapWithRouter: (children: JSX.Element) => JSX.Element;
}): Promise<JSX.Element> {
  const { useDocument } = options;
  const { AppComponent, PageComponent } = getPageComponents({
    pageObject,
    env: RuntimeEnvironment.SERVER,
  });

  const render = (App: NextApp, Page: NextPage) => {
    return <App Component={Page} pageProps={pageProps} />;
  };

  // Return an empty dummy document if useDocument is not enabled
  if (!useDocument) {
    return (
      <html>
        <head></head>
        <body>
          <div id={NEXT_ROOT_ELEMENT_ID}>
            {wrapWithRouter(render(AppComponent, PageComponent))}
          </div>
        </body>
      </html>
    );
  }

  const customDocumentFile = getDocumentFile({ options });
  const Document = customDocumentFile.server.default;

  const renderPage: RenderPage = (options = {}) => {
    const {
      App: EnhancedApp,
      Component: EnhancedComponent,
    } = enhanceComponents(options, AppComponent, PageComponent);

    let head: JSX.Element[] = [];
    const html = renderToString(
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
        {wrapWithRouter(render(EnhancedApp, EnhancedComponent))}
      </HeadManagerContext.Provider>
    );
    return { html, head };
  };

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
      props: { pageProps },
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
  };

  return Document.renderDocument(Document, documentProps);
}
