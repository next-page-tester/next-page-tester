import React from 'react';
import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from 'next/document';
import { RenderPageResult } from 'next/dist/next-server/lib/utils';

type Props = RenderPageResult & {
  description: string;
};

class CustomDocument extends Document<Props> {
  static getInitialProps = async (ctx: DocumentContext) => {
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
          <meta name="description" content={this.props.description} />
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
