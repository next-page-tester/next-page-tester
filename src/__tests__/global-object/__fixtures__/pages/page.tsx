import React from 'react';
import { PropsPrinter } from '../../../__utils__';

export default function Page(props: { [key: string]: unknown }) {
  return (
    <>
      <h2>Page</h2>
      <PropsPrinter suppressHydrationWarning={true} props={props} />
    </>
  );
}
