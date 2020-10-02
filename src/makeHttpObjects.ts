import httpMocks from 'node-mocks-http';
import type { OptionsWithDefaults, PageObject } from './commonTypes';

export default function makeHttpObjects({
  pageObject: { params, route },
  reqMocker,
  resMocker,
}: {
  pageObject: PageObject;
  reqMocker: OptionsWithDefaults['req'];
  resMocker: OptionsWithDefaults['res'];
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
