import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Index() {
  const { locale, locales, defaultLocale } = useRouter();
  return (
    <>
      <h1>Index page</h1>
      <span>{JSON.stringify({ locale, locales, defaultLocale })}</span>
      <Link href="/fr/another">
        <a>To /fr/another</a>
      </Link>
    </>
  );
}
