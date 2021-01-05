import React from 'react';
import Document, { Html, Head, NextScript, Main } from 'next/document';
import type {
  DocumentProps as NextDocumentProps,
  DocumentType,
} from 'next/dist/next-server/lib/utils';

export type DocumentProps = NextDocumentProps & {
  pageElement: React.ReactNode;
};

class DefaultDocument extends Document {
  render() {
    return (
      <Html>
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default (DefaultDocument as unknown) as DocumentType;
