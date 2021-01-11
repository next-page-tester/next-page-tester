import React, { useState, useCallback, useRef } from 'react';
import { RouterContext } from 'next/dist/next-server/lib/router-context';
import makeRouterMock, { PushHandler } from './makeRouterMock';
import { useMountedState } from './utils';
import type { ExtendedOptions, Page, PageObject } from './commonTypes';

export default function RouterProvider({
  pageObject,
  options,
  children: initialChildren,
  makePage,
}: {
  pageObject: PageObject;
  options: ExtendedOptions;
  children: JSX.Element;
  makePage: (optionsOverride?: Partial<ExtendedOptions>) => Promise<Page>;
}) {
  const isMounted = useMountedState();
  const previousRouteRef = useRef(pageObject.route);

  const pushHandler = useCallback(async (url: Parameters<PushHandler>[0]) => {
    const nextRoute = url.toString();
    const nextOptions = { ...options, route: nextRoute };

    const previousRoute = previousRouteRef.current;
    const { pageElement, pageObject } = await makePage({
      route: nextRoute,
      previousRoute,
      env: 'client',
    });
    previousRouteRef.current = nextRoute;

    const nextRouter = makeRouterMock({
      options: nextOptions,
      pageObject,
      pushHandler,
    });

    // Avoid errors if page gets unmounted
    if (isMounted()) {
      setState({ router: nextRouter, children: pageElement });
    } else {
      console.warn(
        `[next-page-tester] Un-awaited client side navigation from "${previousRoute}" to "${nextRoute}". This might lead into unexpected bugs and errors.`
      );
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
