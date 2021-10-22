import React from 'react';
import { MockedProvider } from '@apollo/client/testing';
import { ALL_POSTS_QUERY, allPostsQueryVars } from './__fixtures__/api/posts';
import type { PageWrapper } from '../../../../commonTypes';

export const mocks = [
  {
    request: {
      query: ALL_POSTS_QUERY,
      variables: allPostsQueryVars,
    },
    result: {
      data: {
        allPosts: [
          {
            id: '1',
            title: 'Post B',
            url: '/post-b',
            votes: 5,
            createdAt: Date.now(),
          },
        ],
        _allPostsMeta: {
          count: 1,
        },
      },
    },
  },
] as const;

export const Page: PageWrapper = (Page) => (pageProps) => (
  <MockedProvider mocks={mocks}>
    <Page {...pageProps} />
  </MockedProvider>
);
