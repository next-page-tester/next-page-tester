import React from 'react';
import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from 'next/document';
import { CounterContext } from '../../counter';

export default class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    return ctx.renderPage({
      enhanceComponent: (Component) => (props) => (
        <CounterContext.Provider value={{ count: 150 }}>
          <Component {...props} />
        </CounterContext.Provider>
      ),
    });
  }

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
