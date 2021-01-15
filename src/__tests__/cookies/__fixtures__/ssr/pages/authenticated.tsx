import React from 'react';
import type { GetServerSideProps } from 'next';
import Link from 'next/link';

type Props = {
  reqHeadersCookie?: string;
  reqCookies?: Record<string, unknown>;
};

export default function Authenticated({ reqHeadersCookie, reqCookies }: Props) {
  return (
    <div>
      <span>Authenticated content</span>
      <Link href="/login">
        <a>To login</a>
      </Link>
      <div>req.headers.cookies: "{reqHeadersCookie}"</div>
      <div>req.cookies: "{JSON.stringify(reqCookies)}"</div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async ({
  req,
}) => {
  return {
    props: {
      reqHeadersCookie: req.headers.cookie,
      reqCookies: req.cookies,
    },
  };
};
