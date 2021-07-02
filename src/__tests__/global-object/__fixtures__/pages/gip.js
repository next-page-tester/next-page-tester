import React from 'react';
import { PropsPrinter } from '../../../__utils__';

const importTime_window = typeof window !== 'undefined';
const importTime_document = typeof document !== 'undefined';
const importTime_navigator = typeof navigator !== 'undefined';

export default function gip(props) {
  const component_runTime_window = typeof window !== 'undefined';
  const component_runTime_document = typeof document !== 'undefined';
  const component_runTime_navigator = typeof navigator !== 'undefined';

  return (
    <>
      <h2>Page</h2>
      <PropsPrinter
        suppressHydrationWarning={true}
        props={{
          component_importTime_window: importTime_window,
          component_importTime_document: importTime_document,
          component_importTime_navigator: importTime_navigator,
          component_runTime_window,
          component_runTime_document,
          component_runTime_navigator,
          ...props,
        }}
      />
    </>
  );
}

gip.getInitialProps = async () => {
  const dataFetching_runTime_window = typeof window !== 'undefined';
  const dataFetching_runTime_document = typeof document !== 'undefined';
  const dataFetching_runTime_navigator = typeof navigator !== 'undefined';

  return {
    dataFetching_importTime_window: importTime_window,
    dataFetching_importTime_document: importTime_document,
    dataFetching_importTime_navigator: importTime_navigator,
    dataFetching_runTime_window,
    dataFetching_runTime_document,
    dataFetching_runTime_navigator,
  };
};
