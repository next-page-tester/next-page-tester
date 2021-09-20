import React from 'react';
import { PropsPrinter } from '../../../../../__utils__';

export default function param_with_dash(props) {
  return (
    <>
      /param/with-dash/param-with-dash -
      <PropsPrinter props={props} />
    </>
  );
}
