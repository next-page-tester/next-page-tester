import React from 'react';
import { sleep, PropsPrinter } from '../../../../__utils__/';

export default function CustomDocumentWithGIP_SSR(props) {
  return (
    <>
      <span>/custom-document-with-gip/ssr -</span>
      <span>
        <PropsPrinter props={props} />
      </span>
    </>
  );
}

export async function getServerSideProps(ctx) {
  await sleep(1);
  return {
    props: {
      fromPage: true,
      propNameCollision: 'from-page',
    },
  };
}
