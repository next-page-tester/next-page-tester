import React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';

class CustomDocument extends Document {
  static getInitialProps = async (ctx) => {
    const initialProps = await Document.getInitialProps(ctx);
    return {
      ...initialProps,
      description: 'Custom document description',
    };
  };

  render() {
    return (
      <Html lang="en">
        <Head>
          <meta name="Description" content={this.props.description} />
        </Head>

        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default CustomDocument;
