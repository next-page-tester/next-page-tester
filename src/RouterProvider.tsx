import React, { useState, useCallback, useRef } from 'react';

import { RouterContext } from 'next/dist/next-server/lib/router-context';
import makeRouterMock, { PushHandler } from './makeRouterMock';
import { useMountedState } from './utils';
import {
  ExtendedOptions,
  Page,
  RuntimeEnvironment,
  RouteData,
} from './commonTypes';

type Props = {
  routerEnhancer: ExtendedOptions['router'];
  routeData: RouteData;
  children: JSX.Element;
  makePage: (optionsOverride?: Partial<ExtendedOptions>) => Promise<Page>;
};

export default function RouterProvider({
  routerEnhancer,
  routeData,
  children: initialChildren,
  makePage,
}: Props) {
  const isMounted = useMountedState();
  const previousRouteRef = useRef(routeData.route);

  const pushHandler = useCallback(async (url: Parameters<PushHandler>[0]) => {
    const nextRoute = url.toString();
    const previousRoute = previousRouteRef.current;
    const { pageElement, pageObject } = await makePage({
      route: nextRoute,
      previousRoute,
      env: RuntimeEnvironment.CLIENT,
    });
    previousRouteRef.current = nextRoute;

    const nextRouter = makeRouterMock({
      routeData: pageObject,
      pushHandler,
      routerEnhancer,
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
      routerEnhancer,
      routeData,
      pushHandler,
    }),
  }));

  return (
    <RouterContext.Provider value={router}>{children}</RouterContext.Provider>
  );
}
