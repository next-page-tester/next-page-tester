import React from 'react';
import type { GetServerSideProps } from 'next';

type Props = {
  referer: string;
};

export default function PageA({ referer }: Props) {
  return (
    <>
      <div>Page A</div>
      <div>req.headers.referer: "{referer}"</div>
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
