import React from 'react';
// @ts-expect-error TS we're testing errors
import sss from '../unknown-extension.foo';

export default function UnknownExtension() {
  console.log(sss);
  return <>pop</>;
}
