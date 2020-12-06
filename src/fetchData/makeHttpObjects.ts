import httpMocks from 'node-mocks-http';
import type { OptionsWithDefaults, PageObject } from '../commonTypes';

export default function makeHttpObjects({
  pageObject: { params, route },
  reqMocker,
  resMocker,
  appendCookie,
  refererRoute,
}: {
  pageObject: PageObject;
  reqMocker: OptionsWithDefaults['req'];
  resMocker: OptionsWithDefaults['res'];
  appendCookie?: boolean;
  refererRoute?: string;
}) {
  const req = httpMocks.createRequest({
    url: route,
    params: { ...params },
  });

  // Make document.cookie available in req.headers
  // @NOTE: SHall we make available req.headers, too?
  if (appendCookie && document && document.cookie) {
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
