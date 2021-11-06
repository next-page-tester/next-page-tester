import { AppContext, AppProps } from 'next/app';
import React from 'react';
import qs from 'querystring';

export default function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <div className="APP">
      _app.jsx
      <Component {...pageProps} />
    </div>
  );
}

CustomApp.getInitialProps = async ({ ctx, router }: AppContext) => {
  if (ctx.req && ctx.res) {
    const url = ctx.req.url ?? '';
    const { destination: Location } = qs.parse(url.split(/\?/)[1]);
    if (Location) {
      ctx.res.writeHead(302, { Location });
      ctx.res.end();
    }
  } else {
    const { destination: Location } = router.query;
    if (Location) {
      router.push(Location as string);
    }
  }

  return {
    pageProps: {},
  };
};
