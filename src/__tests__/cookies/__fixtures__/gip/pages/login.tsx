import React from 'react';
import { useRouter } from 'next/router';
import type { NextPage } from 'next';

type Props = {
  reqHeadersCookie?: string;
};

const Login: NextPage<Props> = ({ reqHeadersCookie }) => {
  const router = useRouter();

  const handleLogin = () => {
    document.cookie = 'sessionId=bar';
    router.push('/authenticated');
  };

  return (
    <div>
      <button onClick={handleLogin}>Login</button>
      <div>req.headers.cookies: "{reqHeadersCookie}"</div>
    </div>
  );
};

Login.getInitialProps = function ({ req }) {
  return {
    reqHeadersCookie: req?.headers?.cookie,
  };
};

export default Login;
