import { fetchPageData } from '../fetchData';
import { makeNotFoundPageObject } from './makeNotFoundPageObject';
import type { ExtendedOptions, PageInfo } from '../commonTypes';

export async function get404PageInfo({
  options,
}: {
  options: ExtendedOptions;
}): Promise<PageInfo> {
  const pageObject = makeNotFoundPageObject({ options });
  const pageData = await fetchPageData({ pageObject, options });
  pageData.props = {
    ...pageData.props,
    statusCode: 404,
  };

  return { pageData, pageObject };
}
