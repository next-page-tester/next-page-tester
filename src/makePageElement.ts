import getPageObject from './getPageObject';
import getCustomAppFile from './getCustomAppFile';
import { fetchAppData, fetchPageData } from './fetchData';
import preparePage from './preparePage';
import type { ExtendedOptions } from './commonTypes';

/*
 * Return an instance of the page element corresponding
 * to the given path
 */
export default async function makePageElement({
  options,
}: {
  options: ExtendedOptions;
}) {
  const pageObject = await getPageObject({ options });
  if (pageObject === undefined) {
    throw new Error(
      '[next page tester] No matching page found for given route'
    );
  }

  const customAppFile = options.useCustomApp
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
