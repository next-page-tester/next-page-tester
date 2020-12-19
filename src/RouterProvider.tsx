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
  children: initialChildren,
  makePage,
}: {
  pageObject: PageObject;
  options: ExtendedOptions;
  children: JSX.Element;
  makePage: (route: string) => Promise<JSX.Element>;
}) {
  const isMounted = useMountedState();

  const pushHandler = useCallback(async (url: Parameters<PushHandler>[0]) => {
    const nextRoute = url.toString();
    const nextOptions = { ...options, route: nextRoute };

    const nextPageObject = await getPageObject({
      options: nextOptions,
    });
    const nextPage = await makePage(nextRoute);

    // Avoid errors if page gets unmounted
    /* istanbul ignore next */
    if (isMounted()) {
      const nextRouter = makeRouterMock({
        options: nextOptions,
        pageObject: nextPageObject,
        pushHandler,
      });

      setState({ router: nextRouter, children: nextPage });
    }
  }, []);

  const [{ children, router }, setState] = useState(() => ({
    children: initialChildren,
    router: makeRouterMock({
      options,
      pageObject,
      pushHandler,
    }),
  }));

  return (
    <RouterContext.Provider value={router}>{children}</RouterContext.Provider>
  );
}
