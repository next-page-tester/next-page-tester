import React from 'react';
import DefaultErrorPage from 'next/error';
import getCustomErrorFile from './getCustomErrorFile';
import fetchErrorData from './fetchErrorData';
import { HttpError } from './Error';

import type { ServerResponse } from 'http';

import type { ExtendedOptions } from '../commonTypes';
import { parseRouteData } from '../utils';
import { wrapWithDocument } from '../_document/render';

export default async function renderErrorPage({
  options,
  err,
  res,
}: {
  options: ExtendedOptions;
  err: HttpError;
  res: ServerResponse;
}) {
  const customErrorFile = getCustomErrorFile({ options });
  let ServerErrorPage = DefaultErrorPage;
  let ClientErrorPage = DefaultErrorPage;
  if (customErrorFile) {
    ServerErrorPage = (customErrorFile.server
      .default as unknown) as typeof DefaultErrorPage;
    ClientErrorPage = (customErrorFile.client
      .default as unknown) as typeof DefaultErrorPage;
  }

  const { pathname, query } = parseRouteData(options.route);

  const initialProps = await fetchErrorData({
    ErrorPage: ServerErrorPage,
    pathname,
    query,
    err,
    res,
  });

  return {
    clientPageElement: <ClientErrorPage {...initialProps} />,
    serverPageElement: wrapWithDocument(<ServerErrorPage {...initialProps} />),
  };
}
