import React from 'react';
import App from 'next/app';
import { CounterContext } from '../counter';

export default class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    return (
      <CounterContext.Provider value={{ count: 150 }}>
        <Component {...pageProps} />
      </CounterContext.Provider>
    );
  }
}
