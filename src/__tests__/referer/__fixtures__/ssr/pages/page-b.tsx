import React from 'react';
import type { GetServerSideProps } from 'next';
import Link from 'next/link';

type Props = {
  referer: string;
};

export default function PageB({ referer }: Props) {
  return (
    <>
      <div>req.headers.referer: "{referer}"</div>
      <Link href="/page-c">
        <a>To /page-c</a>
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
