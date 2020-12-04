import React from 'react';
import nextCookie from 'next-cookies';
import type { GetServerSideProps } from 'next';

export default function Authenticated() {
  return (
    <div>
      <span>Authenticated content</span>
      <div>Cookie: {document.cookie}</div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const params = nextCookie(context);

  // TODO: test this once redirects are implemented
  if (params.SessionId !== 'super-secret') {
    return {
      redirect: {
        destination: '/',
        permanent: true,
      },
    };
  }

  return { props: {} };
};
