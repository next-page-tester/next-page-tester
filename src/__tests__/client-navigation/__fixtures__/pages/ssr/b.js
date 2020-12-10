import React from 'react';

export default function ClientSideNavigationBGIP(props) {
  return (
    <div>
      <h2>This is page B</h2>
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
