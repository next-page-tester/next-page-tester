import React from 'react';
import type { GetServerSideProps } from 'next';
import Link from 'next/link';

type Props = {
  referer: string;
};

export default function PageC({ referer }: Props) {
  return (
    <>
      <div>req.headers.referer: "{referer}"</div>
      <Link href="/page-a">
        <a>To /page-a</a>
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
