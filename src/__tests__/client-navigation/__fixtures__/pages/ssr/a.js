import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function ClientSideNavigationAGIP(props) {
  const href = '/ssr/b?foo=bar';

  const { replace } = useRouter();

  const goToPageBstring = () => {
    replace(href);
  };

  const goToPageBObject = () => {
    replace({ pathname: '/ssr/b', query: { foo: 'bar' } });
  };

  return (
    <div>
      <h2>This is page A</h2>
      <Link href={href}>
        <a>Go to B with Link</a>
      </Link>
      <a onClick={goToPageBstring}>Go to B programmatically (with string)</a>
      <a onClick={goToPageBObject}>Go to B programmatically (with object)</a>

      <span>{JSON.stringify(props)}</span>
    </div>
  );
}

export const getServerSideProps = (ctx) => {
  return {
    props: {
      isWindowDefined: global.window !== undefined,
      isDocumentDefined: global.document !== undefined,
      isReqDefined: ctx.req !== undefined,
      isResDefined: ctx.res !== undefined,
    },
  };
};
