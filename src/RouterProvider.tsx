import React, { useMemo, useState, useCallback } from 'react';
import type { NextRouter } from 'next/router';
import { RouterContext } from 'next/dist/next-server/lib/router-context';
import makeRouterMock from './makeRouterMock';
import getPageObject from './getPageObject';
import { useMountedState } from './utils';
import type { ExtendedOptions, PageObject } from './commonTypes';

function makeRouterMockInstance({
  options,
  pageObject,
  updateRouterMock,
}: {
  options: ExtendedOptions;
  pageObject: PageObject;
  updateRouterMock: (routerMock: NextRouter) => void;
}) {
  const { router: routerMocker } = options;
  return routerMocker(
    makeRouterMock({
      pageObject,
      pushHandler: async (url) => {
        const nextRoute = url.toString();
        const nextOptions = {
          ...options,
          route: nextRoute,
        };
        const nextPageObject = await getPageObject({
          options: nextOptions,
        });
        const nextRouter = makeRouterMockInstance({
          options: nextOptions,
          pageObject: nextPageObject,
          updateRouterMock,
        });
        updateRouterMock(nextRouter);
      },
    })
  );
}

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
  const updateRouterMock = useCallback(
    (newRouter: NextRouter) => {
      // Avoid errors if page gets unmounted
      if (isMounted()) {
        setRouterMock(newRouter);
      }
    },
    [setRouterMock, isMounted]
  );
  const initialRouterMock = useMemo(
    () =>
      makeRouterMockInstance({
        options,
        pageObject,
        updateRouterMock,
      }),
    []
  );

  return (
    <RouterContext.Provider value={routerMock || initialRouterMock}>
      {children}
    </RouterContext.Provider>
  );
}
