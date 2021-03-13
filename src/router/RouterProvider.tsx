import React, { useState, useCallback, useRef } from 'react';
import { RouterContext } from 'next/dist/next-server/lib/router-context';
import { formatUrl } from 'next/dist/next-server/lib/router/utils/format-url';
import makeRouterMock, { PushHandler } from './makeRouterMock';
import { useMountedState } from '../utils';
import { ExtendedOptions, MakePageResult, PageObject } from '../commonTypes';
import { RuntimeEnvironment } from '../constants';

export default function RouterProvider({
  pageObject,
  options,
  children: initialChildren,
  makePage,
}: {
  pageObject: PageObject;
  options: ExtendedOptions;
  children: JSX.Element;
  makePage: (
    optionsOverride?: Partial<ExtendedOptions>
  ) => Promise<MakePageResult>;
}) {
  const isMounted = useMountedState();
  const previousRouteRef = useRef(pageObject.route);

  const pushHandler: PushHandler = useCallback(
    async (url, _$, transitionOptions) => {
      let nextRoute = typeof url === 'string' ? url : formatUrl(url);
      if (transitionOptions?.locale && nextRoute.startsWith('/')) {
        nextRoute = `/${transitionOptions.locale}${nextRoute}`;
      }

      const nextOptions = { ...options, route: nextRoute };
      const previousRoute = previousRouteRef.current;
      const { pageElement, pageObject } = await makePage({
        route: nextRoute,
        previousRoute,
        env: RuntimeEnvironment.CLIENT,
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
    },
    []
  );

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
