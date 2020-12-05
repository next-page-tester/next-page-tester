import httpMocks from 'node-mocks-http';
import type { OptionsWithDefaults, PageObject } from '../commonTypes';

export default function makeHttpObjects({
  pageObject: { params, route },
  reqMocker,
  resMocker,
}: {
  pageObject: PageObject;
  reqMocker: OptionsWithDefaults['req'];
  resMocker: OptionsWithDefaults['res'];
}) {
  const req = reqMocker(
    httpMocks.createRequest({
      url: route,
      params: { ...params },
    })
  );

  if (req.headers.cookie) {
    req.headers.cookie.split(';').forEach((value) => {
      document.cookie = value.replace(/^ +/, '');
    });
  }

  return {
    req,
    res: resMocker(httpMocks.createResponse()),
  };
}
