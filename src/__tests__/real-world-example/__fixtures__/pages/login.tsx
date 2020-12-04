import React from 'react';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';

export default function Login() {
  const router = useRouter();

  const handleLogin = () => {
    document.cookie = 'SessionId=super-secret';
    router.push('/authenticated');
  };

  return (
    <div>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {},
  };
};
