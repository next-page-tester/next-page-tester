import { existsSync } from 'fs';
import getPageObject from './getPageObject';
import getCustomAppFile from './getCustomAppFile';
import { fetchAppData, fetchPageData } from './fetchData';
import preparePage from './preparePage';
import { defaultNextRoot, findPagesDirectory } from './utils';
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
      '[next page tester] cannot find "nextRoot" directory under: ${nextRoot}'
    );
  }
}

export default async function getPage({
  route,
  nextRoot = defaultNextRoot,
  req = (req) => req,
  res = (res) => res,
  router = (router) => router,
  customApp = false,
  pageExtensions = ['mdx', 'jsx', 'js', 'ts', 'tsx'],
}: Options): Promise<React.ReactElement> {
  const optionsWithDefaults: OptionsWithDefaults = {
    route,
    nextRoot,
    req,
    res,
    router,
    customApp,
    pageExtensions,
  };
  validateOptions(optionsWithDefaults);

  const options: ExtendedOptions = {
    ...optionsWithDefaults,
    pagesDirectory: findPagesDirectory({ nextRoot }),
  };

  const pageObject = await getPageObject({ options });
  if (pageObject === undefined) {
    throw new Error(
      '[next page tester] no matching page found for given route'
    );
  }

  const customAppFile = customApp
    ? await getCustomAppFile({ options })
    : undefined;

  const appInitialProps = customAppFile
    ? await fetchAppData({ customAppFile, pageObject, options })
    : undefined;

  const pageData = await fetchPageData({
    pageObject,
    options,
    appInitialProps,
  });

  const pageElement = await preparePage({
    pageObject,
    pageData,
    options,
  });
  return pageElement;
}
