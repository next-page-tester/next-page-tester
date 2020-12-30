import { Fragment } from 'react';
import NextDocument, { DocumentInitialProps } from 'next/document';
import type { PageObject } from '../commonTypes';
import type { DocumentType, RenderPage } from 'next/dist/next-server/lib/utils';
import { executeAsIfOnServer } from '../server';

export default async function fetchDocumentData({
  Document,
  pageObject,
  renderPage,
}: {
  Document: DocumentType;
  pageObject: PageObject;
  renderPage: RenderPage;
}): Promise<DocumentInitialProps> {
  // @NOTE: Document has always a getInitialProps since inherits from NextDocument
  /* istanbul ignore next */
  const getDocumentInitialProps =
    Document.getInitialProps || NextDocument.getInitialProps;

  return executeAsIfOnServer(() =>
    getDocumentInitialProps({
      renderPage,
      pathname: pageObject.pagePath,
      query: pageObject.query,
      AppTree: Fragment,
    })
  );
}
