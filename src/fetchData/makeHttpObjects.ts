import httpMocks from 'node-mocks-http';
import type { OptionsWithDefaults, GenericPageObject } from '../commonTypes';

export default function makeHttpObjects({
  pageObject: { params, route },
  reqMocker,
  resMocker,
  refererRoute,
}: {
  pageObject: GenericPageObject;
  reqMocker: OptionsWithDefaults['req'];
  resMocker: OptionsWithDefaults['res'];
  refererRoute?: string;
}) {
  const req = httpMocks.createRequest({
    url: route,
    params: { ...params },
  });

  if (document && document.cookie) {
    req.headers.cookie = document.cookie;
  }

  if (refererRoute !== undefined && window) {
    req.headers.referer = `${window.location.href}${refererRoute.substring(1)}`;
  }

  return {
    req: reqMocker(req),
    res: resMocker(httpMocks.createResponse()),
  };
}
