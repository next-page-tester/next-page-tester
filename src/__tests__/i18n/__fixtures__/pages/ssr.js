import React from 'react';

export default function SSR({ locale, locales, defaultLocale }) {
  return <span>{JSON.stringify({ locale, locales, defaultLocale })}</span>;
}

export async function getServerSideProps(ctx) {
  return {
    props: ctx,
  };
}
