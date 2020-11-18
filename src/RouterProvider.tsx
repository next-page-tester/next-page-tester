import React, { useMemo, useState } from 'react';
import { RouterContext } from 'next/dist/next-server/lib/router-context';
import makeRouterMock from './makeRouterMock';
import getPageObject from './getPageObject';
import type { ExtendedOptions, PageObject } from './commonTypes';

function makeRouterMockInstance({
  options,
  pageObject,
  setRouterMock,
}: {
  options: ExtendedOptions;
  pageObject: PageObject;
  setRouterMock: (routerMock: ReturnType<typeof makeRouterMock>) => void;
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
          setRouterMock,
        });
        setRouterMock(nextRouter);
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
  const [routerMock, setRouterMock] = useState<
    ReturnType<typeof makeRouterMock>
  >();
  const initialRouterMock = useMemo(
    () =>
      makeRouterMockInstance({
        options,
        pageObject,
        setRouterMock,
      }),
    []
  );

  return (
    <RouterContext.Provider value={routerMock || initialRouterMock}>
      {children}
    </RouterContext.Provider>
  );
}
