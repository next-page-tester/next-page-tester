import { Fragment } from 'react';
import NextDocument, { DocumentInitialProps } from 'next/document';
import type { RouteData } from '../commonTypes';
import type { DocumentType, RenderPage } from 'next/dist/next-server/lib/utils';
import { executeAsIfOnServer } from '../server';

export default async function fetchDocumentData({
  Document,
  renderPage,
  routeData,
}: {
  Document: DocumentType;
  routeData: RouteData;
  renderPage: RenderPage;
}): Promise<DocumentInitialProps> {
  // @NOTE: Document has always a getInitialProps since inherits from NextDocument
  /* istanbul ignore next */
  const getDocumentInitialProps =
    Document.getInitialProps || NextDocument.getInitialProps;

  return executeAsIfOnServer(() =>
    getDocumentInitialProps({
      renderPage,
      pathname: routeData.pagePath,
      query: routeData.query,
      AppTree: Fragment,
    })
  );
}
