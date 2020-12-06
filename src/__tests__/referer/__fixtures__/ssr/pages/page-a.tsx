import React from 'react';
import type { GetServerSideProps } from 'next';
import Link from 'next/link';

type Props = {
  referer: string;
};

export default function PageA({ referer }: Props) {
  return (
    <>
      <div>req.headers.referer: "{referer}"</div>
      <Link href="/page-b">
        <a>To /page-b</a>
      </Link>
    </>
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
