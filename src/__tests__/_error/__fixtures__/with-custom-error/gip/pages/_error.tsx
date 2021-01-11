import React from 'react';
import { ErrorProps } from 'next/error';

type Props = ErrorProps;

export default function CustomError({ statusCode }: Props) {
  return (
    <p>
      [CustomError] It looks like we have some problems. Status: {statusCode}
    </p>
  );
}
