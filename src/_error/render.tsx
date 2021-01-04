import React from 'react';
import DefaultErrorPage from 'next/error';
import getCustomErrorFile from './getCustomErrorFile';
import fetchErrorData from './fetchErrorData';
import { HttpError } from './Error';

import type { ServerResponse } from 'http';

import type { ExtendedOptions } from '../commonTypes';
import { parseRouteData } from '../utils';

export default async function renderErrorPage({
  options,
  route,
  err,
  res,
}: {
  options: ExtendedOptions;
  err: HttpError;
  res: ServerResponse;
  route: string;
}) {
  const customErrorFile = getCustomErrorFile({ options });
  let ErrorPage = DefaultErrorPage;
  if (customErrorFile) {
    ErrorPage = (customErrorFile.client
      .default as unknown) as typeof DefaultErrorPage;
  }

  const { pathname, query } = parseRouteData(options.route);

  const initialProps = await fetchErrorData({
    ErrorPage,
    pathname,
    query,
    err,
    res,
  });

  return <ErrorPage {...initialProps} />;
}
