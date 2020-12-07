import React from 'react';
import type { NextPage } from 'next';
import Link from 'next/link';

type Props = {
  reqHeadersCookie?: string;
};

const Authenticated: NextPage<Props> = ({ reqHeadersCookie }) => {
  return (
    <div>
      <span>Authenticated content</span>
      <Link href="/login">
        <a>To login</a>
      </Link>
      <div>req.headers.cookies: "{reqHeadersCookie}"</div>
    </div>
  );
};

Authenticated.getInitialProps = async function ({ req }) {
  if (req) {
    return {
      reqHeadersCookie: req.headers.cookie,
    };
  }
  return { reqHeadersCookie: document.cookie };
};

export default Authenticated;
