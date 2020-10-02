import httpMocks from 'node-mocks-http';
import type { Options, PageObject } from './commonTypes';

export default function makeHttpObjects({
  pageObject: { params, route },
  reqMocker,
  resMocker,
}: {
  pageObject: PageObject;
  reqMocker: Exclude<Options['req'], undefined>;
  resMocker: Exclude<Options['res'], undefined>;
}) {
  return {
    req: reqMocker(
      httpMocks.createRequest({
        url: route,
        params: { ...params },
      })
    ),
    res: resMocker(httpMocks.createResponse()),
  };
}
