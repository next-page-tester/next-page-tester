import React from 'react';
import { useRouter } from 'next/router';

export default function Another() {
  const { locale, locales, defaultLocale, push } = useRouter();
  return (
    <>
      <h1>Another page</h1>
      <span>{JSON.stringify({ locale, locales, defaultLocale })}</span>
      <button
        onClick={() => {
          push('/', '/', { locale: 'nl-NL' });
        }}
      >
        to /nl-NL/index
      </button>
    </>
  );
}
