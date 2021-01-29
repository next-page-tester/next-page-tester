import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { useApollo } from '../lib/apolloClient';
import { PageProps } from '../../../../../../commonTypes';

export default function App({
  Component,
  pageProps,
}: {
  Component: React.ElementType;
  pageProps: PageProps;
}) {
  const apolloClient = useApollo(pageProps);

  return (
    <ApolloProvider client={apolloClient}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}
