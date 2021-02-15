import React from 'react';
import App from 'next/app';

// @ts-expect-error testing how we handle require errors
ewqjewqj;

export default class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    return <Component {...pageProps} />;
  }
}
