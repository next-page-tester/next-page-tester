import React from 'react';

export default function SSG({ locale, locales, defaultLocale }) {
  return <span>{JSON.stringify({ locale, locales, defaultLocale })}</span>;
}

export async function getStaticProps(ctx) {
  return {
    props: ctx,
  };
}
