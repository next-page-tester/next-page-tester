import React from 'react';
import type { GetStaticProps } from 'next';
import { PostList } from '../components/PostList';
import { initializeApollo, addApolloState } from '../lib/apolloClient';

export default function IndexPage() {
  return <PostList />;
}

export const getStaticProps: GetStaticProps = async () => {
  const apolloClient = initializeApollo();

  return addApolloState(apolloClient, {
    props: {},
    revalidate: 1,
  });
};
