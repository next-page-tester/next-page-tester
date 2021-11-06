import httpMocks from 'node-mocks-http';
import type { OptionsWithDefaults, PageObject, Req, Res } from '../commonTypes';
import { EventEmitter } from 'events';
import { InternalError } from '../_error';
import type { Redirect } from 'next';

const isRedirectCode = (
  statusCode: number
): statusCode is 301 | 302 | 303 | 307 | 308 => {
  return [301, 302, 303, 307, 308].includes(statusCode);
};

export default function makeHttpObjects({
  pageObject: { params, route },
  reqMocker,
  resMocker,
  refererRoute,
  onRedirect,
}: {
  pageObject: PageObject;
  reqMocker: OptionsWithDefaults['req'];
  resMocker: OptionsWithDefaults['res'];
  refererRoute?: string;
  onRedirect: (redirect: Redirect) => void;
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

  const res = httpMocks.createResponse({
    eventEmitter: EventEmitter,
  });

  res.on('end', () => {
    if (isRedirectCode(res.statusCode)) {
      const { location } = res.getHeaders();
      if (typeof location !== 'string') {
        throw new InternalError(`res.end() called without location header`);
      }
      onRedirect({ statusCode: res.statusCode, destination: location });
    } else {
      throw new InternalError(
        `res.end() called with unsuported status code: ${res.statusCode}`
      );
    }
  });

  return {
    req: reqMocker(req),
    res: resMocker(res),
  };
}
