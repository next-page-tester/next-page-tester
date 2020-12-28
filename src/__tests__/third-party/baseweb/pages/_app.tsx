import React from 'react';
import App from 'next/app';
import { Provider as StyletronProvider } from 'styletron-react';
import { LightTheme, BaseProvider } from 'baseui';
import { styletron } from '../styletron';

export default class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    return (
      <StyletronProvider value={styletron}>
        <BaseProvider theme={LightTheme}>
          <Component {...pageProps} />
          <div>Custom _app element</div>
        </BaseProvider>
      </StyletronProvider>
    );
  }
}
