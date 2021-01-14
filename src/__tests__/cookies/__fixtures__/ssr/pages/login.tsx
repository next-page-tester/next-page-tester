import React from 'react';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';

type Props = {
  reqHeadersCookie?: string;
  reqCookies?: Record<string, unknown>;
};

export default function Login({ reqHeadersCookie, reqCookies }: Props) {
  const router = useRouter();

  const handleLogin = () => {
    document.cookie = 'sessionId=bar';
    router.push('/authenticated');
  };

  return (
    <div>
      <button onClick={handleLogin}>Login</button>
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
