import React from 'react';

export default function CustomApp() {
  return <>special-extension/page</>;
}

export async function getServerSideProps(ctx) {
  return {
    props: {
      fromPage: true,
      propNameCollision: 'from-page',
    },
  };
}
