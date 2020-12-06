import React from 'react';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';

type Props = {
  reqHeadersCookie?: string;
};

export default function Login({ reqHeadersCookie }: Props) {
  const router = useRouter();

  const handleLogin = () => {
    document.cookie = 'SessionId=super-secret';
    router.push('/authenticated');
  };

  return (
    <div>
      <button onClick={handleLogin}>Login</button>
      <div>req.headers.cookies: "{reqHeadersCookie}"</div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async ({
  req,
}) => {
  return { props: { reqHeadersCookie: req.headers.cookie } };
};
