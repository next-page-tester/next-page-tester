import type {
  ExtendedOptions,
  NotFoundPageObject,
  PageInfo,
  PageObject,
} from '../commonTypes';
import { get404File } from './get404File';
import { fetchPageData } from '../fetchData';

export async function render404Page({
  pageObject: notFoundPageObject,
  options,
}: {
  pageObject: NotFoundPageObject | PageObject;
  options: ExtendedOptions;
}): Promise<PageInfo> {
  const pageObject = {
    ...notFoundPageObject,
    page: get404File({ options }),
  };

  const pageData = await fetchPageData({ pageObject, options });
  pageData.props = {
    ...pageData.props,
    statusCode: 404,
  };

  return { pageData, pageObject };
}
