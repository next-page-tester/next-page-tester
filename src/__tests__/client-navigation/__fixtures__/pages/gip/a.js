import React from 'react';
import { PageA } from '../../PageA';

export default function ClientSideNavigationAGIP(props) {
  return (
    <>
      <PageA
        href="/gip/b?foo=bar"
        hrefObject={{ pathname: '/gip/b', query: { foo: 'bar' } }}
      />

      <span>{JSON.stringify(props)}</span>
    </>
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
