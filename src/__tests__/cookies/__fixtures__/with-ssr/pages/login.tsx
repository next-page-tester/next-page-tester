import React from 'react';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import nextCookie from 'next-cookies';

type Props = {
  cookies: object;
};

export default function Login({ cookies }: Props) {
  const router = useRouter();

  const handleLogin = () => {
    document.cookie = 'SessionId=super-secret';
    router.push('/authenticated');
  };

  return (
    <div>
      <button onClick={handleLogin}>Login</button>
      <div>Cookie: {JSON.stringify(cookies)}</div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  const cookies = nextCookie(context);
  return { props: { cookies } };
};
