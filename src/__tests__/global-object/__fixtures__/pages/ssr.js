import React from 'react';
import { PropsPrinter } from '../../../__utils__';

const importTime_window = typeof window !== 'undefined';
const importTime_document = typeof document !== 'undefined';

export default function ssr(props) {
  const component_runTime_window = typeof window !== 'undefined';
  const component_runTime_document = typeof document !== 'undefined';

  return (
    <>
      <h2>Page</h2>
      <PropsPrinter
        suppressHydrationWarning={true}
        props={{
          component_importTime_window: importTime_window,
          component_importTime_document: importTime_document,
          component_runTime_window,
          component_runTime_document,
          ...props,
        }}
      />
    </>
  );
}

export async function getServerSideProps() {
  const dataFetching_runTime_window = typeof window !== 'undefined';
  const dataFetching_runTime_document = typeof document !== 'undefined';

  return {
    props: {
      dataFetching_importTime_window: importTime_window,
      dataFetching_importTime_document: importTime_document,
      dataFetching_runTime_window,
      dataFetching_runTime_document,
    },
  };
}
