import type { ExtendedOptions, PageObject } from '../commonTypes';
import { get404File } from './get404File';
import { notFoundResponseEnhancer } from './response';
import { fetchPageData } from '../fetchData';

export async function render404Page({
  pageObject,
  options,
}: {
  pageObject: PageObject;
  options: ExtendedOptions;
}) {
  options.res = notFoundResponseEnhancer({ options });
  pageObject.page = get404File({ options });
  return fetchPageData({ pageObject, options });
}
