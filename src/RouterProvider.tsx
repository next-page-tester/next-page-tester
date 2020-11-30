import React, { useMemo, useState, useCallback } from 'react';
import type { NextRouter } from 'next/router';
import { RouterContext } from 'next/dist/next-server/lib/router-context';
import makeRouterMock, { PushHandler } from './makeRouterMock';
import getPageObject from './getPageObject';
import { useMountedState } from './utils';
import type { ExtendedOptions, PageObject } from './commonTypes';

export default function RouterProvider({
  pageObject,
  options,
  children,
}: {
  pageObject: PageObject;
  options: ExtendedOptions;
  children: JSX.Element;
}) {
  const [routerMock, setRouterMock] = useState<NextRouter>();
  const isMounted = useMountedState();

  const pushHandler = useCallback(async (url: Parameters<PushHandler>[0]) => {
    const nextRoute = url.toString();
    const nextOptions = {
      ...options,
      route: nextRoute,
    };
    const nextPageObject = await getPageObject({
      options: nextOptions,
    });
    const nextRouter = makeRouterMock({
      options: nextOptions,
      pageObject: nextPageObject,
      pushHandler,
    });

    // Avoid errors if page gets unmounted
    /* istanbul ignore next */
    if (isMounted()) {
      setRouterMock(nextRouter);
    }
  }, []);

  const initialRouterMock = useMemo(
    () =>
      makeRouterMock({
        options,
        pageObject,
        pushHandler,
      }),
    []
  );

  return (
    <RouterContext.Provider value={routerMock || initialRouterMock}>
      {children}
    </RouterContext.Provider>
  );
}
