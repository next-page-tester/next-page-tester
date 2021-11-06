import { getPageInfo } from './getPageInfo';
import type { ExtendedOptions, MakePageResult } from '../commonTypes';
import { renderApp } from '../_app';
import { PushHandler } from '../router/makeRouterMock';

export async function makePageElement({
  options,
  pushHandler,
}: {
  options: ExtendedOptions;
  pushHandler?: PushHandler;
}): Promise<MakePageResult> {
  const { pageData, pageObject } = await getPageInfo({ options, pushHandler });
  const pageElement = renderApp({
    options,
    pageObject,
    pageProps: pageData.props,
    appProps: pageData.appProps,
  });

  return { pageElement, pageObject };
}
