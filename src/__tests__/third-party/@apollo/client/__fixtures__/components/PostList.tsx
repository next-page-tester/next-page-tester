import React from 'react';
import Link from 'next/link';
import { useQuery } from '@apollo/client';
import { ALL_POSTS_QUERY, allPostsQueryVars } from '../api/posts';

type Post = {
  id: string;
  url: string;
  title: string;
};

export function PostList() {
  const { loading, data } = useQuery<{
    allPosts: Post[];
  }>(ALL_POSTS_QUERY, { variables: allPostsQueryVars });

  if (!data || loading) return <div>Loading</div>;

  const { allPosts } = data;

  return (
    <section>
      <ul>
        {allPosts.map((post, index) => (
          <li key={post.id}>
            <div>
              <span>{index + 1}. </span>
              <Link href={post.url}>
                <a href={post.url}>{post.title}</a>
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
