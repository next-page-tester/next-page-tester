import React from 'react';
import type { AppProps } from 'next/app';

const importTime_window = typeof window !== 'undefined';
const importTime_document = typeof document !== 'undefined';
const importTime_navigator = typeof navigator !== 'undefined';

export default function CustomApp({ Component, pageProps }: AppProps) {
  const component_runTime_window = typeof window !== 'undefined';
  const component_runTime_document = typeof document !== 'undefined';
  const component_runTime_navigator = typeof navigator !== 'undefined';

  const props = {
    component_importTime_window: importTime_window,
    component_importTime_document: importTime_document,
    component_importTime_navigator: importTime_navigator,
    component_runTime_window,
    component_runTime_document,
    component_runTime_navigator,
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
  const gip_runTime_navigator = typeof navigator !== 'undefined';

  return {
    pageProps: {
      gip_importTime_window: importTime_window,
      gip_importTime_document: importTime_document,
      gip_importTime_navigator: importTime_navigator,
      gip_runTime_window,
      gip_runTime_document,
      gip_runTime_navigator,
    },
  };
};
