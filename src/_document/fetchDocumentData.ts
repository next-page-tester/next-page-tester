import { Fragment } from 'react';
import NextDocument, { DocumentInitialProps } from 'next/document';
import type { RouteInfo } from '../commonTypes';
import type { DocumentType, RenderPage } from 'next/dist/next-server/lib/utils';
import { executeAsIfOnServer } from '../server';

export default async function fetchDocumentData({
  Document,
  renderPage,
  routeInfo,
}: {
  Document: DocumentType;
  routeInfo: RouteInfo;
  renderPage: RenderPage;
}): Promise<DocumentInitialProps> {
  // @NOTE: Document has always a getInitialProps since inherits from NextDocument
  /* istanbul ignore next */
  const getDocumentInitialProps =
    Document.getInitialProps || NextDocument.getInitialProps;

  return executeAsIfOnServer(() =>
    getDocumentInitialProps({
      renderPage,
      pathname: routeInfo.pagePath,
      query: routeInfo.query,
      AppTree: Fragment,
    })
  );
}
