import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function ClientSideNavigationAGIP(props) {
  const hrefObject = { pathname: '/gip/b', query: { foo: 'bar' } };
  const href = '/gip/b?foo=bar';

  const { replace } = useRouter();

  const goToPageBstring = () => {
    replace(href);
  };

  const goToPageBobject = () => {
    replace(hrefObject);
  };

  return (
    <div>
      <h2>This is page A</h2>

      <Link href={href}>
        <a>Go to B with Link (with string)</a>
      </Link>
      <Link href={hrefObject}>
        <a>Go to B with Link (with object)</a>
      </Link>

      <a onClick={goToPageBstring}>Go to B programmatically (with string)</a>
      <a onClick={goToPageBobject}>Go to B programmatically (with object)</a>

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
