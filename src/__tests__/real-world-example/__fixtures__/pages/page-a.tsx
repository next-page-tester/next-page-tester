import React from 'react';
import type { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';

type Props = {
  referer: string;
};

export default function Home({ referer }: Props) {
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
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  return {
    props: {
      referer: context.req.headers.referer as string,
    },
  };
};
