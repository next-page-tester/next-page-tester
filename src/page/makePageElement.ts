import { getPageInfo } from './getPageInfo';
import type { ExtendedOptions } from '../commonTypes';
import { renderApp } from '../_app';

export async function makePageElement({
  options,
}: {
  options: ExtendedOptions;
}) {
  const { pageData, pageObject } = await getPageInfo({ options });
  const pageElement = renderApp({
    options,
    pageObject,
    pageProps: pageData.props,
  });

  return { pageElement, pageObject };
}
