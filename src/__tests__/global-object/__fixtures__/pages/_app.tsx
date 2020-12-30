import React from 'react';
import type { AppProps } from 'next/app';

const importTime_window = typeof window !== 'undefined';
const importTime_document = typeof document !== 'undefined';

export default function CustomApp({ Component, pageProps }: AppProps) {
  const component_runTime_window = typeof window !== 'undefined';
  const component_runTime_document = typeof document !== 'undefined';

  const props = {
    component_importTime_window: importTime_window,
    component_importTime_document: importTime_document,
    component_runTime_window,
    component_runTime_document,
    ...pageProps,
  };

  return (
    <>
      <Component {...props} />
    </>
  );
}

CustomApp.getInitialProps = async () => {
  const gip_runTime_window = typeof window !== 'undefined';
  const gip_runTime_document = typeof document !== 'undefined';

  return {
    pageProps: {
      gip_importTime_window: importTime_window,
      gip_importTime_document: importTime_document,
      gip_runTime_window,
      gip_runTime_document,
    },
  };
};
