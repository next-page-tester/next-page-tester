import httpMocks from 'node-mocks-http';
import type { OptionsWithDefaults, PageObject, Req, Res } from '../commonTypes';

export default function makeHttpObjects({
  pageObject: { params, route },
  reqMocker,
  resMocker,
  refererRoute,
}: {
  pageObject: PageObject;
  reqMocker: OptionsWithDefaults['req'];
  resMocker: OptionsWithDefaults['res'];
  refererRoute?: string;
}): {
  req: Req;
  res: Res;
} {
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
