import React from 'react';
import { PropsPrinter } from '../../../../__utils__/';

export default function CustomAppWithGIP_Page({ ...props }) {
  return (
    <>
      custom-app-with-gip/page -
      <PropsPrinter props={props} />
    </>
  );
}
