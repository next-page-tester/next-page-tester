import React from 'react';
import { PropsPrinter } from '../../../__utils__';
const window_moduleLoadTime = typeof window !== 'undefined';
const document_moduleLoadTime = typeof document !== 'undefined';

export default function gip(props) {
  return (
    <>
      <h2>Page</h2>
      <PropsPrinter
        props={{
          ...props,
          window_componentScope: typeof window !== 'undefined',
          document_componentScope: typeof document !== 'undefined',
        }}
      />
    </>
  );
}

gip.getInitialProps = async () => {
  return {
    window_moduleLoadTime,
    document_moduleLoadTime,
    window_dataFetchingScope: typeof window !== 'undefined',
    document_dataFetchingScope: typeof document !== 'undefined',
  };
};
