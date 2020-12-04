import React from 'react';
import { useRouter } from 'next/router';

export default function Login() {
  const router = useRouter();

  const handleLogin = () => {
    if (document.cookie) {
      document.cookie = `${document.cookie};SessionId=super-secret`;
    } else {
      document.cookie = 'SessionId=super-secret';
    }

    router.push('/authenticated');
  };

  return (
    <div>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}
