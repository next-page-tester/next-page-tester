import React from 'react';
import nextCookie from 'next-cookies';
import type { GetServerSideProps } from 'next';
import Link from 'next/link';

type Props = {
  cookies: object;
};

export default function Authenticated({ cookies }: Props) {
  return (
    <div>
      <span>Authenticated content</span>
      <Link href="/login">
        <a>To login</a>
      </Link>
      <div>Cookie: {JSON.stringify(cookies)}</div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  const cookies = nextCookie(context);

  // TODO: test this once redirects are implemented
  if (cookies.SessionId !== 'super-secret') {
    return {
      redirect: {
        destination: '/',
        permanent: true,
      },
    };
  }

  return { props: { cookies } };
};
