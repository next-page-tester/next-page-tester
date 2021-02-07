import React from 'react';
import { getPage } from '../../../../../src';
import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import path from 'path';
import { MockedProvider } from '@apollo/client/testing';
import { ALL_POSTS_QUERY, allPostsQueryVars } from './__fixtures__/api/posts';

const mocks = [
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

describe('@apollo/client', () => {
  it('As a user I can test applications using "@apollo/client"', async () => {
    const { render } = await getPage({
      nextRoot: path.join(__dirname, '__fixtures__'),
      route: '/',
      nonIsolatedModules: ['@apollo/client'],
      wrapper: {
        Page: (Page) => (pageProps) => {
          return (
            <MockedProvider mocks={mocks}>
              <Page {...pageProps} />
            </MockedProvider>
          );
        },
      },
    });

    render();

    expect(screen.getByText('Loading')).toBeInTheDocument();

    userEvent.click(
      await screen.findByText(mocks[0].result.data.allPosts[0].title)
    );

    await screen.findByText('PostBPage');
  });
});
