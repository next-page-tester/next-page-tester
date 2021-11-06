import { NextPage } from 'next';
import React from 'react';

const PageA: NextPage = () => {
  return <div>Page A</div>;
};

PageA.getInitialProps = async (ctx) => {
  if (ctx.res) {
    ctx.res.writeHead(302, { Location: '/page-b' });
    ctx.res.end();
  }

  return {
    pageProps: {},
  };
};

export default PageA;
