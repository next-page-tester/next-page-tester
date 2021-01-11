import { Fragment } from 'react';
import { executeAsIfOnServer } from '../server';
import DefaultErrorPage, { ErrorProps } from 'next/error';
import type { ServerResponse } from 'http';
import { HttpError } from './Error';
import { ParsedUrlQuery } from 'querystring';

export default async function fetchErrorData({
  ErrorPage,
  err,
  res,
  pathname,
  query,
}: {
  ErrorPage: typeof DefaultErrorPage;
  pathname: string;
  query: ParsedUrlQuery;
  res: ServerResponse;
  err: HttpError;
}): Promise<ErrorProps> {
  let getErrorPageInitialProps = ErrorPage.getInitialProps;
  if (!getErrorPageInitialProps) {
    getErrorPageInitialProps = DefaultErrorPage.getInitialProps;
  }

  return executeAsIfOnServer(() =>
    getErrorPageInitialProps({
      res,
      err,
      pathname,
      AppTree: Fragment,
      query,
    })
  );
}
