import type {
  ExtendedOptions,
  NotFoundPageObject,
  PageInfo,
  PageObject,
} from '../commonTypes';
import { get404PageFile } from './get404PageFile';
import { fetchPageData } from '../fetchData';

export async function get404PageInfo({
  pageObject: notFoundPageObject,
  options,
}: {
  pageObject: NotFoundPageObject | PageObject;
  options: ExtendedOptions;
}): Promise<PageInfo> {
  const pageObject: PageObject = {
    ...notFoundPageObject,
    type: 'found',
    page: get404PageFile({ options }),
  };

  const pageData = await fetchPageData({ pageObject, options });
  pageData.props = {
    ...pageData.props,
    statusCode: 404,
  };

  return { pageData, pageObject };
}
