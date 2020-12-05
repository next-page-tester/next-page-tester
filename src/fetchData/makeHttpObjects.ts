import httpMocks from 'node-mocks-http';
import type { OptionsWithDefaults, PageObject } from '../commonTypes';

export default function makeHttpObjects({
  pageObject: { params, route },
  reqMocker,
  resMocker,
  isInitialRequest,
}: {
  pageObject: PageObject;
  reqMocker: OptionsWithDefaults['req'];
  resMocker: OptionsWithDefaults['res'];
  isInitialRequest: boolean;
}) {
  const req = reqMocker(
    httpMocks.createRequest({
      url: route,
      params: { ...params },
    })
  );

  // Set document.cookie from request on initial request. After that cookies are
  // handled client side by JSDOM
  if (isInitialRequest && req.headers.cookie) {
    req.headers.cookie.split(';').forEach((value) => {
      document.cookie = value.replace(/^ +/, '');
    });
  }

  return {
    req,
    res: resMocker(httpMocks.createResponse()),
  };
}
