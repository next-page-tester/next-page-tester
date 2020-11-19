import { useState } from 'react';
import { useRouter } from 'next/router';
import { useUpdateEffect } from './utils';

/*
 * Wrap pageElement to trigger a page re-render on route change
 */
export default function NavigationProvider({
  makePage,
  children,
}: {
  makePage: (route: string) => Promise<JSX.Element>;
  children: JSX.Element;
}) {
  const { asPath: route } = useRouter();
  const [pageElement, setPageElement] = useState(children);

  // Re-render page on route change
  useUpdateEffect(() => {
    makePage(route).then(setPageElement);
  }, [route]);

  return pageElement;
}
