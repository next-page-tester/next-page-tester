import React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';
import { CounterContext } from '../counter';

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    return ctx.renderPage((App) => (props) => (
      <CounterContext.Provider value={{ count: 150 }}>
        <App {...props} />
      </CounterContext.Provider>
    ));
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
