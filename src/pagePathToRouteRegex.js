const ANYTHING_BUT_SLASH_REGEX = /[^\/]*/;
export const ANYTHING_BUT_SLASH_REGEX_STRING = ANYTHING_BUT_SLASH_REGEX.toString().slice(
  1,
  -1
);
const DYNAMIC_ROUTE_SEGMENT_REGEX = /\[([^\/\[\]]*)\]/g;
const FILE_EXTENSION_REGEX = /\..*$/;

function pagePathToRouteRegex(pagePath) {
  const regex = pagePath
    .replace(FILE_EXTENSION_REGEX, '')
    .replace(DYNAMIC_ROUTE_SEGMENT_REGEX, ANYTHING_BUT_SLASH_REGEX_STRING);

  // Add route's trailing slash
  return new RegExp(`^${regex}$`);
}

export default pagePathToRouteRegex;
