import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function ClientSideNavigationAGIP(props) {
  const href = '/gip/b';
  const router = useRouter();
  const goToPageB = () => {
    router.replace(href);
  };

  return (
    <div>
      <h2>This is page A</h2>
      <Link href={href}>
        <a>Go to B with Link</a>
      </Link>
      <a onClick={goToPageB}>Go to B programmatically</a>

      <span>{JSON.stringify(props)}</span>
    </div>
  );
}

ClientSideNavigationAGIP.getInitialProps = (ctx) => {
  return {
    isWindowDefined: global.window !== undefined,
    isDocumentDefined: global.document !== undefined,
    isReqDefined: ctx.req !== undefined,
    isResDefined: ctx.res !== undefined,
  };
};
