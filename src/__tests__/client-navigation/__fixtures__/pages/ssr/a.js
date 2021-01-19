import React from 'react';
import { PageA } from '../../PageA';

export default function ClientSideNavigationAGIP(props) {
  return (
    <>
      <PageA
        href="/ssr/b?foo=bar"
        hrefObject={{ pathname: '/ssr/b', query: { foo: 'bar' } }}
      />
      <span>{JSON.stringify(props)}</span>
    </>
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
