import React from 'react';
import { PropsPrinter } from '../../../../__utils__';

export default function ClientSideNavigationBGIP(props) {
  return (
    <div>
      <h2>This is page B</h2>
      <span>{JSON.stringify(props)}</span>
    </div>
  );
}

ClientSideNavigationBGIP.getInitialProps = (ctx) => {
  return {
    isWindowDefined: global.window !== undefined,
    isDocumentDefined: global.document !== undefined,
    isReqDefined: ctx.req !== undefined,
    isResDefined: ctx.res !== undefined,
  };
};
