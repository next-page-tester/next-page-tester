import React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';

class CustomDocument extends Document {
  render() {
    return (
      <>
        <Head>
          <meta name="application-name" content="Static app" />
          <meta name="Description" content="Document with special extension" />
        </Head>

        <body>
          <Main />
          <NextScript />
        </body>
      </>
    );
  }
}

export default CustomDocument;
