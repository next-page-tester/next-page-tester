import React from 'react';
import { ErrorProps } from 'next/error';

type Props = ErrorProps;

export default function CustomError(props: Props) {
  return (
    <>
      <h1>Custom error page</h1>
      <p>{props.statusCode}</p>
    </>
  );
}
