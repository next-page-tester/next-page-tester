import React, { useState } from 'react';
import type { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';

type Props = {
  referer: string;
};

export default function Home({ referer }: Props) {
  const [count, setCount] = useState(0);

  return (
    <div>
      <Head>
        <title>Page A</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div>Came from {referer}</div>

      <Link href="/">
        <a>Back to root</a>
      </Link>

      <div>Count: {count}</div>
      <button onClick={() => setCount((prev) => prev + 1)}>Click me</button>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  return {
    props: {
      referer: context.req.headers.referer || '',
    },
  };
};
