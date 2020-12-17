import React from 'react';
import { PropsPrinter } from '../../../__utils__';

const window_moduleLoadTime = typeof window !== 'undefined';
const document_moduleLoadTime = typeof document !== 'undefined';
const isWeb_moduleLoadTime = window_moduleLoadTime && document_moduleLoadTime;

export default function gip(props) {
  const window_componentScope = typeof window !== 'undefined';
  const document_componentScope = typeof document !== 'undefined';
  const isWeb_componentScope = window_componentScope && document_componentScope;

  return (
    <>
      <h2>Page</h2>
      <PropsPrinter
        props={{
          ...props,
          /* Should be hydrated "client" side where browser is defined */
          window_componentScope,
          document_componentScope,
          isWeb_componentScope,
          window_componentScope_moduleLoadTime: window_moduleLoadTime,
          document_componentScope_moduleLoadTime: document_moduleLoadTime,
          isWeb_componentScope_moduleLoadTime: isWeb_moduleLoadTime,
        }}
      />
    </>
  );
}

gip.getInitialProps = async () => {
  const window_dataFetchingScope = typeof window !== 'undefined';
  const document_dataFetchingScope = typeof document !== 'undefined';
  const isWeb_dataFetchingScope =
    window_dataFetchingScope && document_dataFetchingScope;

  return {
    window_moduleLoadTime,
    document_moduleLoadTime,
    isWeb_moduleLoadTime,
    window_dataFetchingScope,
    document_dataFetchingScope,
    isWeb_dataFetchingScope,
  };
};
