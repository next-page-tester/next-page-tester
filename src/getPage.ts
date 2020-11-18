import { existsSync } from 'fs';
import makePageElement from './makePageElement';
import makePageWrapper from './makePageWrapper';
import type { RenderPageHandler } from './makePageWrapper';
import {
  defaultNextRoot,
  findPagesDirectory,
  getPageExtensions,
} from './utils';
import type {
  Options,
  OptionsWithDefaults,
  ExtendedOptions,
} from './commonTypes';

function validateOptions({ nextRoot, route }: OptionsWithDefaults) {
  if (!route.startsWith('/')) {
    throw new Error('[next page tester] "route" option should start with "/"');
  }

  if (!existsSync(nextRoot)) {
    throw new Error(
      '[next page tester] Cannot find "nextRoot" directory under: ${nextRoot}'
    );
  }
}

export default async function getPage({
  route,
  nextRoot = defaultNextRoot,
  req = (req) => req,
  res = (res) => res,
  router = (router) => router,
  useCustomApp = false,
}: Options): Promise<React.ReactElement> {
  const optionsWithDefaults: OptionsWithDefaults = {
    route,
    nextRoot,
    req,
    res,
    router,
    useCustomApp,
  };
  validateOptions(optionsWithDefaults);

  const options: ExtendedOptions = {
    ...optionsWithDefaults,
    pagesDirectory: findPagesDirectory({ nextRoot }),
    pageExtensions: getPageExtensions({ nextRoot }),
  };
  // @TODO: Consider printing extended options value behind a debug flag

  const pageElement = await makePageElement({ options });
  const renderPage: RenderPageHandler = async ({ route }) => {
    const newOptions = {
      ...options,
      route,
    };
    return makePageElement({ options: newOptions });
  };
  const pageWrapper = await makePageWrapper({ pageElement, renderPage });
  return pageWrapper;
}
